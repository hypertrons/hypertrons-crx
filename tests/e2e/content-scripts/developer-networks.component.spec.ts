import { expect, test, type BrowserContext } from '@playwright/test';
import { cleanupExtensionContext, launchExtensionContext } from './helpers';

test.describe('content script component: developer networks', () => {
  let context: BrowserContext;
  let userDataDir: string;

  test.beforeAll(async () => {
    const launched = await launchExtensionContext('hypercrx-e2e-content-dev-networks-');
    context = launched.context;
    userDataDir = launched.userDataDir;
  });

  test.afterAll(async () => {
    await cleanupExtensionContext(context, userDataDir);
  });

  test('renders perceptor section on a GitHub developer profile page', async () => {
    const page = await context.newPage();
    await page.goto('https://github.com/octocat', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1800);

    const perceptorHeading = page.locator('h2.h4.mb-2', { hasText: 'Perceptor' }).first();
    await expect(perceptorHeading).toBeVisible({ timeout: 30000 });

    const networkButtons = page.locator('span.hypercrx-label');
    await expect(networkButtons).toHaveCount(3);
  });

  test('opens developer activity network modal with expected osgraph link', async () => {
    const page = await context.newPage();
    await page.goto('https://github.com/octocat', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1800);

    const firstNetworkButton = page.locator('span.hypercrx-label').first();
    await expect(firstNetworkButton).toBeVisible({ timeout: 30000 });
    await firstNetworkButton.click();

    const modal = page.locator('div.ReactModal__Content_Custom').first();
    await expect(modal).toBeVisible();
    await expect(modal.locator('a[href*="osgraph.com/graphs/developer-activity/github/octocat"]')).toHaveCount(1);
  });

  test('does not render developer network controls on non-github pages', async () => {
    const page = await context.newPage();
    await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    await expect(page.locator('h2', { hasText: 'Perceptor' })).toHaveCount(0);
    await expect(page.locator('span.hypercrx-label')).toHaveCount(0);
  });
});
