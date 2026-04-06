import { expect, test, type BrowserContext } from '@playwright/test';
import { cleanupExtensionContext, githubRepoUrl, launchExtensionContext } from './helpers';

test.describe('content script component: repo networks', () => {
  let context: BrowserContext;
  let userDataDir: string;

  test.beforeAll(async () => {
    const launched = await launchExtensionContext('hypercrx-e2e-content-repo-networks-');
    context = launched.context;
    userDataDir = launched.userDataDir;
  });

  test.afterAll(async () => {
    await cleanupExtensionContext(context, userDataDir);
  });

  test('renders repo network cards in perceptor networks slot', async () => {
    const page = await context.newPage();
    await page.goto(`${githubRepoUrl}/pulse?redirect=perceptor`, { waitUntil: 'domcontentloaded' });

    const networkSlot = page.locator('#hypercrx-perceptor-slot-repo-networks');
    await expect(networkSlot).toHaveCount(1);
    await expect(networkSlot.locator('.hypertrons-crx-container')).toHaveCount(3);
  });

  test('first repo network card contains project contribution osgraph link', async () => {
    const page = await context.newPage();
    await page.goto(`${githubRepoUrl}/pulse?redirect=perceptor`, { waitUntil: 'domcontentloaded' });

    const contributionLink = page.locator(
      '#hypercrx-perceptor-slot-repo-networks a[href*="osgraph.com/graphs/project-contribution/github/hypertrons/hypertrons-crx"]'
    );
    await expect(contributionLink).toHaveCount(1);
    await expect(contributionLink.first()).toBeVisible();
  });

  test('does not render repo networks slot on non-perceptor repository routes', async () => {
    const page = await context.newPage();
    await page.goto(githubRepoUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);

    await expect(page.locator('#hypercrx-perceptor-slot-repo-networks')).toHaveCount(0);
  });
});
