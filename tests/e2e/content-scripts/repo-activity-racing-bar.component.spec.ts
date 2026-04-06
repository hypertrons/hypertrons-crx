import { expect, test, type BrowserContext } from '@playwright/test';
import { cleanupExtensionContext, githubRepoUrl, launchExtensionContext } from './helpers';

test.describe('content script component: repo activity racing bar', () => {
  let context: BrowserContext;
  let userDataDir: string;

  test.beforeAll(async () => {
    const launched = await launchExtensionContext('hypercrx-e2e-content-racing-bar-');
    context = launched.context;
    userDataDir = launched.userDataDir;
  });

  test.afterAll(async () => {
    await cleanupExtensionContext(context, userDataDir);
  });

  test('renders on perceptor page with controls', async () => {
    const page = await context.newPage();
    await page.goto(`${githubRepoUrl}/pulse?redirect=perceptor`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1400);

    const container = page.locator('#hypercrx-repo-activity-racing-bar');
    await expect(container).toHaveCount(1);

    await expect(container.getByText('Contributor Activity Racing Bar')).toBeVisible();
    await expect(container.getByText('0.5x')).toBeVisible();
    await expect(container.getByText('1x')).toBeVisible();
    await expect(container.getByText('2x')).toBeVisible();
    expect(await container.locator('button').count()).toBeGreaterThanOrEqual(3);
  });

  test('speed controller is interactive', async () => {
    const page = await context.newPage();
    await page.goto(`${githubRepoUrl}/pulse?redirect=perceptor`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1400);

    const container = page.locator('#hypercrx-repo-activity-racing-bar');
    await expect(container).toHaveCount(1);

    const speed2x = container.locator('.ant-segmented-item').filter({ hasText: '2x' }).first();
    await speed2x.click();
    await expect(speed2x).toHaveClass(/ant-segmented-item-selected/);
  });

  test('does not render on non-perceptor repository pages', async () => {
    const page = await context.newPage();
    await page.goto(githubRepoUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);

    await expect(page.locator('#hypercrx-repo-activity-racing-bar')).toHaveCount(0);
  });
});
