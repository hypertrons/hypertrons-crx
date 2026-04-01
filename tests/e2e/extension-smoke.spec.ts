import { chromium, expect, test, type BrowserContext } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const extensionPath = path.resolve(process.cwd(), 'build');
const runHeadless = process.env.PW_E2E_HEADLESS === '1';

test.describe('extension smoke', () => {
  let context: BrowserContext;
  let extensionId: string;
  let userDataDir: string;

  test.beforeAll(async () => {
    if (!fs.existsSync(path.join(extensionPath, 'manifest.json'))) {
      throw new Error('build/manifest.json was not found. Run npm run build before e2e tests.');
    }

    userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hypercrx-e2e-'));

    context = await chromium.launchPersistentContext(userDataDir, {
      // Extension service workers are unreliable in headless mode; opt in via env when needed.
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

  test('popup renders settings button', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);

    await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();
  });

  test('options renders app title', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options.html`);

    await expect(page.getByRole('heading', { name: 'HyperCRX' })).toBeVisible();
  });
});
