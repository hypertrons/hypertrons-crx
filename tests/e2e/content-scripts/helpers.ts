import { chromium, type BrowserContext, type Page } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const extensionPath = path.resolve(process.cwd(), 'build');
const runHeadless = process.env.PW_E2E_HEADLESS === '1';

export const githubRepoUrl = 'https://github.com/hypertrons/hypertrons-crx';

export async function launchExtensionContext(prefix = 'hypercrx-e2e-content-'): Promise<{
  context: BrowserContext;
  userDataDir: string;
}> {
  if (!fs.existsSync(path.join(extensionPath, 'manifest.json'))) {
    throw new Error('build/manifest.json was not found. Run npm run build before e2e tests.');
  }

  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: runHeadless,
    channel: 'chromium',
    ignoreDefaultArgs: ['--disable-extensions'],
    args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
  });

  let serviceWorker = context.serviceWorkers()[0];
  if (!serviceWorker) {
    serviceWorker = await context.waitForEvent('serviceworker');
  }

  return { context, userDataDir };
}

export async function cleanupExtensionContext(context: BrowserContext | undefined, userDataDir: string | undefined) {
  await context?.close();
  if (userDataDir && fs.existsSync(userDataDir)) {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
}

export async function gotoPublicRepo(page: Page) {
  await page.goto(githubRepoUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
}
