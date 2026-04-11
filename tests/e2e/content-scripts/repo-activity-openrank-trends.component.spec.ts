import { expect, test, type BrowserContext } from '@playwright/test';
import { cleanupExtensionContext, githubRepoUrl, gotoPublicRepo, launchExtensionContext } from './helpers';

test.describe('content script component: repo activity openrank trends', () => {
  let context: BrowserContext;
  let userDataDir: string;

  test.beforeAll(async () => {
    const launched = await launchExtensionContext('hypercrx-e2e-content-trends-');
    context = launched.context;
    userDataDir = launched.userDataDir;
  });

  test.afterAll(async () => {
    await cleanupExtensionContext(context, userDataDir);
  });

  test('renders trend component on repository root page', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);

    const trendRow = page.locator('#hypercrx-repo-activity-openrank-trends');
    await expect(trendRow).toHaveCount(1);

    // Chart host container from Bars component (two series charts)
    const chartHost = trendRow.locator('div[style*="height: 350px"]');
    await expect(chartHost).toHaveCount(2);

    // ECharts canvases should be rendered
    expect(await trendRow.locator('canvas').count()).toBeGreaterThan(0);
  });

  test('does not render on non-root repository pages', async () => {
    const page = await context.newPage();
    await page.goto(`${githubRepoUrl}/issues`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);

    const trendRow = page.locator('#hypercrx-repo-activity-openrank-trends');
    await expect(trendRow).toHaveCount(0);
  });
});
