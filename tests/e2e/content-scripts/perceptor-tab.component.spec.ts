import { expect, test, type BrowserContext } from '@playwright/test';
import { cleanupExtensionContext, gotoPublicRepo, launchExtensionContext } from './helpers';

test.describe('content script component: perceptor tab', () => {
  let context: BrowserContext;
  let userDataDir: string;

  test.beforeAll(async () => {
    const launched = await launchExtensionContext('hypercrx-e2e-content-tab-');
    context = launched.context;
    userDataDir = launched.userDataDir;
  });

  test.afterAll(async () => {
    await cleanupExtensionContext(context, userDataDir);
  });

  test('renders on a public GitHub repository page', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);

    const perceptorTab = page.locator('nav[aria-label="Repository"] a[data-tab-item="perceptor"]');
    await expect(perceptorTab).toHaveCount(1);
    await expect(perceptorTab).toBeVisible();
    await expect(perceptorTab).toContainText('Perceptor');
    await expect(perceptorTab).toHaveAttribute('href', /redirect=perceptor/);
  });

  test('is interactive and navigates to perceptor route', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);

    const perceptorTab = page.locator('nav[aria-label="Repository"] a[data-tab-item="perceptor"]');
    await expect(perceptorTab).toBeVisible();

    await perceptorTab.click();
    await expect(page).toHaveURL(/\/pulse\?redirect=perceptor/);
  });

  test('is not rendered on non-GitHub pages', async () => {
    const page = await context.newPage();
    await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    const perceptorTab = page.locator('a[data-tab-item="perceptor"]');
    await expect(perceptorTab).toHaveCount(0);
  });
});
