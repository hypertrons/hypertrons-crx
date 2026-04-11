import { chromium, expect, test, type BrowserContext } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const extensionPath = path.resolve(process.cwd(), 'build');
const runHeadless = process.env.PW_E2E_HEADLESS === '1';

test.describe('extension user flows', () => {
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

  test('navigate from popup to options via settings button', async () => {
    const popupPage = await context.newPage();
    await popupPage.goto(`chrome-extension://${extensionId}/popup.html`);

    // Click Settings button - this opens options in a new tab/window
    const settingsButton = popupPage.getByRole('button', { name: 'Settings' });

    // Wait for new page to be created and navigate
    const [optionsPage] = await Promise.all([context.waitForEvent('page'), settingsButton.click()]);

    // Verify we're on the options page
    await expect(optionsPage.getByRole('heading', { name: 'HyperCRX' })).toBeVisible();
  });

  test('feature toggle persists after page reload', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    // Get the first checkbox
    const firstCheckbox = page.locator('input[type="checkbox"]').first();

    // Check its initial state
    const initialState = await firstCheckbox.isChecked();

    // Toggle it
    await firstCheckbox.click();
    const toggledState = await firstCheckbox.isChecked();
    expect(toggledState).not.toBe(initialState);

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // The state should persist
    const reloadedCheckbox = page.locator('input[type="checkbox"]').first();
    const reloadedState = await reloadedCheckbox.isChecked();
    expect(reloadedState).toBe(toggledState);
  });

  test('locale selection persists after page reload', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    // Get the Chinese locale radio
    const chineseRadio = page.getByRole('radio', { name: /Simplified Chinese/ });

    // Select it
    await chineseRadio.click();
    await expect(chineseRadio).toBeChecked();

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // The locale should still be selected
    const reloadedChineseRadio = page.getByRole('radio', { name: /Simplified Chinese/ });
    await expect(reloadedChineseRadio).toBeChecked();
  });

  test('multiple checkboxes can be toggled independently', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();

    if (count >= 2) {
      const firstCheckbox = checkboxes.nth(0);
      const secondCheckbox = checkboxes.nth(1);

      const firstInitial = await firstCheckbox.isChecked();
      const secondInitial = await secondCheckbox.isChecked();

      // Toggle both
      await firstCheckbox.click();
      await secondCheckbox.click();

      const firstToggled = await firstCheckbox.isChecked();
      const secondToggled = await secondCheckbox.isChecked();

      // Both should change independently
      expect(firstToggled).not.toBe(firstInitial);
      expect(secondToggled).not.toBe(secondInitial);
      // They should be different from each other (unless initial state was identical)
      expect(firstToggled !== secondToggled || firstInitial !== secondInitial).toBe(true);
    }
  });
});
