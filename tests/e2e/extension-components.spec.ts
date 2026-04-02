import { chromium, expect, test, type BrowserContext } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const extensionPath = path.resolve(process.cwd(), 'build');
const runHeadless = process.env.PW_E2E_HEADLESS === '1';

test.describe('extension component-level checks', () => {
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

  test('language card renders and locale options are interactive', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    const languageRadios = page.locator('input[type="radio"]');
    await expect(languageRadios).toHaveCount(2);

    const english = page.locator('input[type="radio"][value="en"]');
    const chinese = page.locator('input[type="radio"][value="zh_CN"]');
    await expect(english).toHaveCount(1);
    await expect(chinese).toHaveCount(1);

    await chinese.check({ force: true });
    await expect(chinese).toBeChecked();

    await page.evaluate(async () => {
      await chrome.storage.sync.set({ locale: 'en' });
    });
  });

  test('feature card renders checkbox list with labels and supports toggle', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    const checkboxes = page.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    expect(count).toBeGreaterThan(0);

    const firstLabel = page.locator('.ant-checkbox-wrapper').first();
    await expect(firstLabel).toBeVisible();
    await expect(firstLabel).not.toHaveText(/^\s*$/);

    const firstCheckbox = checkboxes.first();
    const before = await firstCheckbox.isChecked();
    await firstCheckbox.click();
    await expect(firstCheckbox).toBeChecked({ checked: !before });
  });

  test('github token card renders disabled input and bind/unbind buttons', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    const githubCard = page.locator('.token-options').first();
    await expect(githubCard).toBeVisible();

    const tokenInput = githubCard.locator('input[type="text"][disabled]');
    await expect(tokenInput).toHaveCount(1);

    const bindButton = githubCard.locator('button').first();
    const unbindButton = githubCard.locator('button').nth(1);
    await expect(bindButton).toBeEnabled();
    await expect(unbindButton).toBeEnabled();

    await unbindButton.click();
    await expect(tokenInput).toHaveCount(1);
  });

  test('gitee token card renders disabled input and bind/unbind buttons', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    const giteeCard = page.locator('.token-options').nth(1);
    await expect(giteeCard).toBeVisible();

    const tokenInput = giteeCard.locator('input[type="text"][disabled]');
    await expect(tokenInput).toHaveCount(1);

    const bindButton = giteeCard.locator('button').first();
    const unbindButton = giteeCard.locator('button').nth(1);
    await expect(bindButton).toBeEnabled();
    await expect(unbindButton).toBeEnabled();

    await unbindButton.click();
    await expect(tokenInput).toHaveCount(1);
  });

  test('about card renders repository link and tooltip icon interaction', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    const repoLink = page.locator('a[href="https://github.com/hypertrons/hypertrons-crx"]');
    const aboutCard = page.locator('.Box').filter({ has: repoLink });
    await expect(aboutCard).toBeVisible();
    await expect(repoLink).toBeVisible();

    const tooltipIcon = aboutCard.locator('.tooltip-icon');
    await expect(tooltipIcon).toHaveCount(1);
    await tooltipIcon.hover();
    await expect(page.locator('.ant-tooltip')).toBeVisible();
  });

  test('popup settings button component is rendered and interactive', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);

    const settingsButton = page.getByRole('button', { name: 'Settings' });
    await expect(settingsButton).toBeVisible();
    await expect(settingsButton).toBeEnabled();

    await settingsButton.click();
    await expect
      .poll(() =>
        context
          .pages()
          .map((p) => p.url())
          .some((url) => url === `chrome-extension://${extensionId}/options.html`)
      )
      .toBe(true);
  });
});
