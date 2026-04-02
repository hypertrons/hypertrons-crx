import { chromium, expect, test, type BrowserContext, type Page } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const extensionPath = path.resolve(process.cwd(), 'build');
const runHeadless = process.env.PW_E2E_HEADLESS === '1';
const githubRepoUrl = 'https://github.com/hypertrons/hypertrons-crx';

async function gotoPublicRepo(page: Page) {
  await page.goto(githubRepoUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');
}

test.describe('content scripts components on repository pages', () => {
  let context: BrowserContext;
  let userDataDir: string;

  test.beforeAll(async () => {
    if (!fs.existsSync(path.join(extensionPath, 'manifest.json'))) {
      throw new Error('build/manifest.json was not found. Run npm run build before e2e tests.');
    }

    userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hypercrx-e2e-content-'));

    context = await chromium.launchPersistentContext(userDataDir, {
      headless: runHeadless,
      channel: 'chromium',
      ignoreDefaultArgs: ['--disable-extensions'],
      args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
    });

    let serviceWorker = context.serviceWorkers()[0];
    if (!serviceWorker) {
      serviceWorker = await context.waitForEvent('serviceworker');
    }
  });

  test.afterAll(async () => {
    await context?.close();
    if (userDataDir && fs.existsSync(userDataDir)) {
      fs.rmSync(userDataDir, { recursive: true, force: true });
    }
  });

  test('perceptor tab component is rendered on a public GitHub repo page', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);

    const perceptorTab = page.locator('nav[aria-label="Repository"] a[data-tab-item="perceptor"]');
    await expect(perceptorTab).toHaveCount(1);
    await expect(perceptorTab).toBeVisible();
    await expect(perceptorTab).toContainText('Perceptor');
  });

  test('perceptor tab is interactive and navigates to perceptor route', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);

    const perceptorTab = page.locator('nav[aria-label="Repository"] a[data-tab-item="perceptor"]');
    await expect(perceptorTab).toBeVisible();
    await expect(perceptorTab).toHaveAttribute('href', /redirect=perceptor/);

    await perceptorTab.click();

    await expect(page).toHaveURL(/\/pulse\?redirect=perceptor/);
  });

  test('perceptor layout component renders expected slot containers on perceptor page', async () => {
    const page = await context.newPage();
    await page.goto(`${githubRepoUrl}/pulse?redirect=perceptor`, { waitUntil: 'domcontentloaded' });

    await expect
      .poll(async () => {
        return page.evaluate(() => {
          const hasRacing = !!document.querySelector('#hypercrx-perceptor-slot-repo-activity-racing-bar');
          const hasNetworks = !!document.querySelector('#hypercrx-perceptor-slot-repo-networks');
          return hasRacing && hasNetworks;
        });
      })
      .toBe(true);
  });

  test('perceptor tab is not rendered on extension options page (wrong page type)', async () => {
    const page = await context.newPage();
    // Navigate to a guaranteed non-GitHub page while content script is active on all_urls.
    await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    const perceptorTab = page.locator('a[data-tab-item="perceptor"]');
    await expect(perceptorTab).toHaveCount(0);
  });
});
