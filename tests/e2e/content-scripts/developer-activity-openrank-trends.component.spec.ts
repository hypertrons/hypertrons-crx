import { expect, test, type BrowserContext } from '@playwright/test';
import { cleanupExtensionContext, launchExtensionContext } from './helpers';

test.describe('content script component: developer activity openrank trends', () => {
  let context: BrowserContext;
  let userDataDir: string;
  const developerName = 'octocat';

  test.beforeAll(async () => {
    const launched = await launchExtensionContext('hypercrx-e2e-content-dev-activity-openrank-');
    context = launched.context;
    userDataDir = launched.userDataDir;

    await context.route(`https://oss.open-digger.cn/github/${developerName}/meta.json`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          type: 'user',
          updatedAt: 1706745600000,
          repos: [],
        }),
      });
    });

    await context.route(`https://oss.open-digger.cn/github/${developerName}/activity.json`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          '2024-01': 123.45,
          '2024-02': 234.56,
          '2024-03': 345.67,
        }),
      });
    });

    await context.route(`https://oss.open-digger.cn/github/${developerName}/openrank.json`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          '2024-01': 11.11,
          '2024-02': 22.22,
          '2024-03': 33.33,
        }),
      });
    });
  });

  test.afterAll(async () => {
    await cleanupExtensionContext(context, userDataDir);
  });

  test('renders activity and openrank trend container on a GitHub profile page', async () => {
    const page = await context.newPage();
    await page.goto(`https://github.com/${developerName}`, { waitUntil: 'domcontentloaded' });

    const featureRoot = page.locator('#hypercrx-developer-activity-openrank-trends');
    await expect(featureRoot).toHaveCount(1);
    await expect(featureRoot.locator('h2.h4.mb-3')).toContainText('Activity & OpenRank Trends');
  });

  test('renders chart canvas under developer activity openrank section', async () => {
    const page = await context.newPage();
    await page.goto(`https://github.com/${developerName}`, { waitUntil: 'domcontentloaded' });

    const featureRoot = page.locator('#hypercrx-developer-activity-openrank-trends');
    await expect(featureRoot).toHaveCount(1);
    await expect(featureRoot.locator('canvas')).toHaveCount(1);
  });

  test('does not render developer activity openrank section on non-github pages', async () => {
    const page = await context.newPage();
    await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    await expect(page.locator('#hypercrx-developer-activity-openrank-trends')).toHaveCount(0);
  });
});
