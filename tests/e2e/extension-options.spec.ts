import { chromium, expect, test, type BrowserContext } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const extensionPath = path.resolve(process.cwd(), 'build');
const runHeadless = process.env.PW_E2E_HEADLESS === '1';

test.describe('extension options page', () => {
  let context: BrowserContext;
  let extensionId: string;
  let userDataDir: string;

  test.beforeAll(async () => {
    if (!fs.existsSync(path.join(extensionPath, 'manifest.json'))) {
      throw new Error('build/manifest.json was not found. Run npm run build before e2e tests.');
    }

    userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hypercrx-e2e-'));

    context = await chromium.launchPersistentContext(userDataDir, {
      headless: runHeadless,
      channel: 'chromium',
      ignoreDefaultArgs: ['--disable-extensions'],
      args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
    });

    let [serviceWorker] = context.serviceWorkers();
    if (!serviceWorker) {
      serviceWorker = await context.waitForEvent('serviceworker');
    }

    extensionId = new URL(serviceWorker.url()).host;
  });

  test.afterAll(async () => {
    await context?.close();
    if (userDataDir && fs.existsSync(userDataDir)) {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    }
  });

  test('page renders title and sections', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    // Main title
    await expect(page.getByRole('heading', { name: 'HyperCRX' })).toBeVisible();

    // Section headers should exist (they are h2 elements)
    await expect(page.getByRole('heading', { name: 'Language' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Select Components' })).toBeVisible();
  });

  test('locale radio options are interactive', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    // Check that both locale options exist
    const englishRadio = page.getByRole('radio', { name: 'English' });
    const chineseRadio = page.getByRole('radio', { name: /Simplified Chinese/ });

    await expect(englishRadio).toBeVisible();
    await expect(chineseRadio).toBeVisible();

    // Should be able to click Chinese option
    await chineseRadio.click();
    await expect(chineseRadio).toBeChecked();
  });

  test('language component renders exactly two locale radios', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    await expect(page.locator('input[type="radio"]')).toHaveCount(2);
  });

  test('feature checkboxes are present and interactive', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    // At least one checkbox should exist (each imported feature)
    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    expect(count).toBeGreaterThan(0);

    // Try to toggle the first checkbox
    if (count > 0) {
      const firstCheckbox = checkboxes.first();
      const initialState = await firstCheckbox.isChecked();
      await firstCheckbox.click();
      const newState = await firstCheckbox.isChecked();
      expect(newState).not.toBe(initialState);
    }
  });

  test('token sections are rendered', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    // Token sections should have buttons for bind/unbind actions
    // Look for buttons that contain common token action text
    const bindButtons = page.locator('button');
    const buttonCount = await bindButtons.count();

    // Should have at least the Settings button from smoke test,
    // plus token bind/unbind buttons
    expect(buttonCount).toBeGreaterThanOrEqual(1);
  });

  test('token components render expected controls and are interactive', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    const tokenSections = page.locator('.token-options');
    await expect(tokenSections).toHaveCount(2);

    for (let i = 0; i < 2; i++) {
      const section = tokenSections.nth(i);
      await expect(section.locator('input[type="text"][disabled]')).toHaveCount(1);
      await expect(section.locator('button')).toHaveCount(2);

      const bindButton = section.locator('button').first();
      const unbindButton = section.locator('button').nth(1);
      await expect(bindButton).toBeEnabled();
      await expect(unbindButton).toBeEnabled();

      // Unbind should be safe to click even when no account is currently bound.
      await unbindButton.click();
      await expect(section.locator('input[type="text"][disabled]')).toHaveCount(1);
    }
  });

  test('tooltip trigger components are rendered and interactive', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    const tooltipIcons = page.locator('.tooltip-icon');
    const iconCount = await tooltipIcons.count();
    expect(iconCount).toBeGreaterThan(0);

    await tooltipIcons.first().hover();
    await expect(page.locator('.ant-tooltip')).toBeVisible();
  });

  test('about section has github link', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    const githubLink = page.locator('a[href*="github.com"]');
    await expect(githubLink).toBeVisible();
  });

  test('options page does not render popup-only settings button', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    await expect(page.getByRole('button', { name: 'Settings' })).toHaveCount(0);
  });

  test('page renders without errors', async () => {
    const page = await context.newPage();

    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter out false positives from webpack-dev-server, React dev warnings, and deprecations
        if (
          !text.includes('[webpack-dev-server]') &&
          !text.includes('WebSocket connection') &&
          !text.includes('Warning: Each child in a list') &&
          !text.includes('overlayClassName') &&
          !text.includes('DeprecationWarning')
        ) {
          consoleErrors.push(text);
        }
      }
    });

    await page.goto(`chrome-extension://${extensionId}/options.html`);
    await page.waitForLoadState('networkidle');

    expect(consoleErrors).toEqual([]);
  });
});
