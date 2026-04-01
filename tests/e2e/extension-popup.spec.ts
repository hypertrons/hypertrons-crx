import { chromium, expect, test, type BrowserContext } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const extensionPath = path.resolve(process.cwd(), 'build');
const runHeadless = process.env.PW_E2E_HEADLESS === '1';

test.describe('extension popup page', () => {
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

  test('settings button is visible and clickable', async () => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup.html`);

    const settingsButton = page.getByRole('button', { name: 'Settings' });
    await expect(settingsButton).toBeVisible();
    await expect(settingsButton).toBeEnabled();
  });

  test('popup renders without errors', async () => {
    const page = await context.newPage();

    // Capture console errors
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filter out false positives from webpack-dev-server, React dev warnings, and deprecations
        if (
          !text.includes('[webpack-dev-server]') &&
          !text.includes('WebSocket connection') &&
          !text.includes('Warning:') &&
          !text.includes('DeprecationWarning')
        ) {
          consoleErrors.push(text);
        }
      }
    });

    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    await page.waitForLoadState('networkidle');

    // Should have no console errors
    expect(consoleErrors).toEqual([]);
  });
});
