import { expect, test, type BrowserContext } from '@playwright/test';
import { cleanupExtensionContext, githubRepoUrl, launchExtensionContext } from './helpers';

test.describe('content script component: perceptor layout', () => {
  let context: BrowserContext;
  let userDataDir: string;

  test.beforeAll(async () => {
    const launched = await launchExtensionContext('hypercrx-e2e-content-layout-');
    context = launched.context;
    userDataDir = launched.userDataDir;
  });

  test.afterAll(async () => {
    await cleanupExtensionContext(context, userDataDir);
  });

  test('renders expected slot containers on perceptor page', async () => {
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

  test('renders each slot exactly once', async () => {
    const page = await context.newPage();
    await page.goto(`${githubRepoUrl}/pulse?redirect=perceptor`, { waitUntil: 'domcontentloaded' });

    await expect(page.locator('#hypercrx-perceptor-slot-repo-activity-racing-bar')).toHaveCount(1);
    await expect(page.locator('#hypercrx-perceptor-slot-repo-networks')).toHaveCount(1);
  });
});
