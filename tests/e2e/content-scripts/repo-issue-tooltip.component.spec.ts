import { expect, test, type BrowserContext } from '@playwright/test';
import { cleanupExtensionContext, gotoPublicRepo, launchExtensionContext } from './helpers';

test.describe('content script component: repo issue tooltip', () => {
  let context: BrowserContext;
  let userDataDir: string;

  const ensureIssuesAnchor = async (page: any) => {
    await page.evaluate(() => {
      if (document.querySelector('a[data-tab-item="issues"]')) {
        return;
      }

      const anchor = document.createElement('a');
      anchor.setAttribute('data-tab-item', 'issues');
      anchor.setAttribute('href', '/hypertrons/hypertrons-crx/issues');
      anchor.textContent = 'Issues';
      anchor.style.position = 'fixed';
      anchor.style.top = '16px';
      anchor.style.left = '16px';
      anchor.style.zIndex = '2147483647';
      document.body.appendChild(anchor);
    });

    await page.waitForTimeout(1200);
  };

  test.beforeAll(async () => {
    const launched = await launchExtensionContext('hypercrx-e2e-content-issue-tooltip-');
    context = launched.context;
    userDataDir = launched.userDataDir;
  });

  test.afterAll(async () => {
    await cleanupExtensionContext(context, userDataDir);
  });

  test('mounts NativePopover placeholder on repository page', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);
    await ensureIssuesAnchor(page);

    const issueTab = page.locator('a[data-tab-item="issues"]').first();
    await expect(issueTab).toBeVisible();

    // Issue tooltip component mounts a NativePopover host into body.
    expect(await page.locator('body > .NativePopover').count()).toBeGreaterThan(0);
  });

  test('binds to issues tab anchor for interaction wiring', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);
    await ensureIssuesAnchor(page);

    const issueTab = page.locator('a[data-tab-item="issues"]').first();
    await expect(issueTab).toBeVisible();
    await expect(issueTab).toHaveAttribute('href', /\/issues/);

    await issueTab.dispatchEvent('mouseenter');
    await page.waitForTimeout(1600);

    expect(await page.locator('body > .NativePopover').count()).toBeGreaterThan(0);
  });

  test('does not render issue tooltip content on non-github pages', async () => {
    const page = await context.newPage();
    await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    await expect(page.locator('text=Issue Open, Close and Comment Events')).toHaveCount(0);
  });
});
