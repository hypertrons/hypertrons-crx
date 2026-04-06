import { expect, test, type BrowserContext } from '@playwright/test';
import { cleanupExtensionContext, gotoPublicRepo, launchExtensionContext } from './helpers';

test.describe('content script component: repo star tooltip', () => {
  let context: BrowserContext;
  let userDataDir: string;

  test.beforeAll(async () => {
    const launched = await launchExtensionContext('hypercrx-e2e-content-star-tooltip-');
    context = launched.context;
    userDataDir = launched.userDataDir;
  });

  test.afterAll(async () => {
    await cleanupExtensionContext(context, userDataDir);
  });

  test('mounts NativePopover placeholder on repository page', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);

    // Star feature binds to star button selectors in GitHub repository header.
    const starTarget = page
      .locator(
        'button[data-hydro-click*="STAR_BUTTON"], button[data-hydro-click*="UNSTAR_BUTTON"], button[data-ga-click*="star button"], a[data-hydro-click*="star button"], a[data-ga-click*="star button"]'
      )
      .first();

    await expect(starTarget).toBeVisible();
    expect(await page.locator('body > .NativePopover').count()).toBeGreaterThan(0);
  });

  test('star target has expected interaction anchor attributes', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);

    const starTarget = page
      .locator(
        'button[data-hydro-click*="STAR_BUTTON"], button[data-hydro-click*="UNSTAR_BUTTON"], button[data-ga-click*="star button"], a[data-hydro-click*="star button"], a[data-ga-click*="star button"]'
      )
      .first();

    await expect(starTarget).toBeVisible();
    await expect(starTarget).toBeEnabled();

    const href = await starTarget.getAttribute('href');
    const hydro = await starTarget.getAttribute('data-hydro-click');
    const ga = await starTarget.getAttribute('data-ga-click');
    const hasExpectedSignal =
      (href ?? '').includes('/stargazers') ||
      (hydro ?? '').toLowerCase().includes('star') ||
      (ga ?? '').toLowerCase().includes('star');
    expect(hasExpectedSignal).toBe(true);
  });

  test('does not render star tooltip content on non-github pages', async () => {
    const page = await context.newPage();
    await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    await expect(page.locator('text=Star Events')).toHaveCount(0);
  });
});
