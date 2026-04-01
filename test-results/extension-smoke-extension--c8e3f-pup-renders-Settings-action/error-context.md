# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: extension-smoke.spec.ts >> extension smoke >> popup renders Settings action
- Location: tests/e2e/extension-smoke.spec.ts:41:3

# Error details

```
Error: browserType.launchPersistentContext: Executable doesn't exist at /Users/harry/Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing
╔════════════════════════════════════════════════════════════╗
║ Looks like Playwright was just installed or updated.       ║
║ Please run the following command to download new browsers: ║
║                                                            ║
║     npx playwright install                                 ║
║                                                            ║
║ <3 Playwright Team                                         ║
╚════════════════════════════════════════════════════════════╝
```

# Test source

```ts
  1  | import { chromium, expect, test, type BrowserContext } from '@playwright/test';
  2  | import fs from 'node:fs';
  3  | import os from 'node:os';
  4  | import path from 'node:path';
  5  | 
  6  | const extensionPath = path.resolve(process.cwd(), 'build');
  7  | 
  8  | test.describe('extension smoke', () => {
  9  |   let context: BrowserContext;
  10 |   let extensionId: string;
  11 |   let userDataDir: string;
  12 | 
  13 |   test.beforeAll(async () => {
  14 |     if (!fs.existsSync(path.join(extensionPath, 'manifest.json'))) {
  15 |       throw new Error('build/manifest.json was not found. Run npm run build before e2e tests.');
  16 |     }
  17 | 
  18 |     userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hypercrx-e2e-'));
  19 | 
> 20 |     context = await chromium.launchPersistentContext(userDataDir, {
     |               ^ Error: browserType.launchPersistentContext: Executable doesn't exist at /Users/harry/Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing
  21 |       channel: 'chromium',
  22 |       headless: true,
  23 |       args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  24 |     });
  25 | 
  26 |     let [serviceWorker] = context.serviceWorkers();
  27 |     if (!serviceWorker) {
  28 |       serviceWorker = await context.waitForEvent('serviceworker');
  29 |     }
  30 | 
  31 |     extensionId = new URL(serviceWorker.url()).host;
  32 |   });
  33 | 
  34 |   test.afterAll(async () => {
  35 |     await context?.close();
  36 |     if (userDataDir && fs.existsSync(userDataDir)) {
  37 |       fs.rmSync(userDataDir, { recursive: true, force: true });
  38 |     }
  39 |   });
  40 | 
  41 |   test('popup renders Settings action', async () => {
  42 |     const page = await context.newPage();
  43 |     await page.goto(`chrome-extension://${extensionId}/popup.html`);
  44 | 
  45 |     await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();
  46 |   });
  47 | 
  48 |   test('options renders HyperCRX header', async () => {
  49 |     const page = await context.newPage();
  50 |     await page.goto(`chrome-extension://${extensionId}/options.html`);
  51 | 
  52 |     await expect(page.getByText('HyperCRX')).toBeVisible();
  53 |   });
  54 | });
  55 | 
```