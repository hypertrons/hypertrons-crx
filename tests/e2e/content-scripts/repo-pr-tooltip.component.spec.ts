import { expect, test, type BrowserContext, type Page } from '@playwright/test';
import { cleanupExtensionContext, githubRepoUrl, gotoPublicRepo, launchExtensionContext } from './helpers';

test.describe('content script component: repo pr tooltip', () => {
  let context: BrowserContext;
  let userDataDir: string;

  const mockSeries = {
    '2025-12': 10,
    '2026-01': 12,
    '2026-02': 15,
  };

  const triggerPRTabHover = async (page: Page) => {
    const pullRequestsTab = page.locator('a[data-tab-item="pull-requests"], #pull-requests-tab').first();
    await expect(pullRequestsTab).toBeVisible();
    await pullRequestsTab.dispatchEvent('mouseenter');
    await page.waitForTimeout(1800);
  };

  const ensurePopoverScaffold = async (page: Page) => {
    await page.evaluate(() => {
      let pageRoot = document.querySelector(
        'body > div.logged-in.env-production.page-responsive'
      ) as HTMLElement | null;
      if (!pageRoot) {
        pageRoot = document.createElement('div');
        pageRoot.className = 'logged-in env-production page-responsive';
        document.body.appendChild(pageRoot);
      }

      let popoverRoot = pageRoot.querySelector(
        'div.Popover.js-hovercard-content.position-absolute'
      ) as HTMLElement | null;
      if (!popoverRoot) {
        popoverRoot = document.createElement('div');
        popoverRoot.className = 'Popover js-hovercard-content position-absolute';
        popoverRoot.style.display = 'none';
        pageRoot.appendChild(popoverRoot);
      }

      if (!popoverRoot.querySelector('div.Popover-message')) {
        const level1 = document.createElement('div');
        const level2 = document.createElement('div');
        const level3 = document.createElement('div');
        level3.className = 'Popover-message';
        level2.appendChild(level3);
        level1.appendChild(level2);
        popoverRoot.appendChild(level1);
      }
    });
  };

  test.beforeAll(async () => {
    const launched = await launchExtensionContext('hypercrx-e2e-content-pr-tooltip-');
    context = launched.context;
    userDataDir = launched.userDataDir;

    await context.route('https://oss.open-digger.cn/github/hypertrons/hypertrons-crx/meta.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          type: 'repo',
          updatedAt: 1710000000,
        }),
      });
    });

    const metricFiles = [
      'change_requests.json',
      'change_requests_accepted.json',
      'change_requests_reviews.json',
      'code_change_lines_add.json',
      'code_change_lines_remove.json',
    ];

    for (const metricFile of metricFiles) {
      await context.route(
        `https://oss.open-digger.cn/github/hypertrons/hypertrons-crx/${metricFile}`,
        async (route) => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockSeries),
          });
        }
      );
    }
  });

  test.afterAll(async () => {
    await cleanupExtensionContext(context, userDataDir);
  });

  test('mounts NativePopover placeholder on repository page', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);
    await ensurePopoverScaffold(page);

    expect(await page.locator('body > .NativePopover').count()).toBeGreaterThan(0);
  });

  test('does not render PR tooltip on non-github pages', async () => {
    const page = await context.newPage();
    await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    await expect(page.locator('text=Open PR, PR Merge, Review Comment Events')).toHaveCount(0);
  });

  test('binds to pull requests tab anchor for interaction wiring', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);
    await ensurePopoverScaffold(page);

    const pullRequestsTab = page.locator('a[data-tab-item="pull-requests"], #pull-requests-tab').first();
    await expect(pullRequestsTab).toBeVisible();
    await expect(pullRequestsTab).toHaveAttribute('href', /\/pulls/);

    await triggerPRTabHover(page);
    expect(await page.locator('body > .NativePopover').count()).toBeGreaterThan(0);
  });
});
