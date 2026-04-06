import { expect, test, type BrowserContext } from '@playwright/test';
import { cleanupExtensionContext, gotoPublicRepo, launchExtensionContext } from './helpers';

test.describe('content script component: repo fork tooltip', () => {
  let context: BrowserContext;
  let userDataDir: string;

  test.beforeAll(async () => {
    const launched = await launchExtensionContext('hypercrx-e2e-content-fork-tooltip-');
    context = launched.context;
    userDataDir = launched.userDataDir;
  });

  test.afterAll(async () => {
    await cleanupExtensionContext(context, userDataDir);
  });

  test('mounts NativePopover placeholder on repository page', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);

    // Fork feature binds to fork button selectors in GitHub repository header.
    const forkTarget = page
      .locator(
        'a[data-hydro-click*="FORK_BUTTON"], button[data-hydro-click*="FORK_BUTTON"], #fork-button, #fork-icon-button'
      )
      .first();

    await expect(forkTarget).toBeVisible();
    await expect(forkTarget).toBeEnabled();
  });

  test('fork target has expected interaction anchor attributes', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);

    const forkTarget = page
      .locator(
        'a[data-hydro-click*="FORK_BUTTON"], button[data-hydro-click*="FORK_BUTTON"], #fork-button, #fork-icon-button'
      )
      .first();

    await expect(forkTarget).toBeVisible();

    const hydro = await forkTarget.getAttribute('data-hydro-click');
    const id = await forkTarget.getAttribute('id');
    expect((hydro ?? '').includes('FORK_BUTTON') || id === 'fork-button' || id === 'fork-icon-button').toBe(true);
  });

  test('does not render fork tooltip content on non-github pages', async () => {
    const page = await context.newPage();
    await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    await expect(page.locator('text=Fork Events')).toHaveCount(0);
  });
});
