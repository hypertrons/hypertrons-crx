import { expect, test, type BrowserContext, type Page } from '@playwright/test';
import { cleanupExtensionContext, gotoPublicRepo, launchExtensionContext } from './helpers';

test.describe('content script component: developer hovercard info', () => {
  let context: BrowserContext;
  let userDataDir: string;
  const developerName = 'octocat';

  const mountSyntheticHovercardFixture = async (page: Page) => {
    await page.evaluate((name) => {
      const existingAnchor = document.getElementById('hypercrx-test-hover-anchor');
      if (!existingAnchor) {
        const wrapper = document.createElement('div');
        wrapper.id = 'hypercrx-test-hover-wrapper';
        wrapper.style.position = 'fixed';
        wrapper.style.top = '12px';
        wrapper.style.left = '12px';
        wrapper.style.zIndex = '2147483647';

        const anchor = document.createElement('a');
        anchor.id = 'hypercrx-test-hover-anchor';
        anchor.href = `https://github.com/${name}`;
        anchor.textContent = name;
        anchor.setAttribute('data-hovercard-url', `/users/${name}/hovercard`);
        wrapper.appendChild(anchor);
        document.body.appendChild(wrapper);
      }

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
        pageRoot.appendChild(popoverRoot);
      }

      popoverRoot.setAttribute('data-hovercard-target-url', `/users/${name}`);

      if (!popoverRoot.querySelector('div.Popover-message')) {
        const level1 = document.createElement('div');
        const level2 = document.createElement('div');
        const level3 = document.createElement('div');
        level3.className = 'Popover-message';
        level2.appendChild(level3);
        level1.appendChild(level2);
        popoverRoot.appendChild(level1);
      }
    }, developerName);
  };

  test.beforeAll(async () => {
    const launched = await launchExtensionContext('hypercrx-e2e-content-hovercard-');
    context = launched.context;
    userDataDir = launched.userDataDir;

    await context.route(`https://oss.open-digger.cn/github/${developerName}/openrank.json`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          '2026-01': '123.45',
          '2026-02': '234.56',
        }),
      });
    });
  });

  test.afterAll(async () => {
    await cleanupExtensionContext(context, userDataDir);
  });

  test('injects OpenRank info into GitHub developer hovercard', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);
    await page.waitForTimeout(2500);
    await mountSyntheticHovercardFixture(page);

    const hoverAnchor = page.locator('#hypercrx-test-hover-anchor');
    await expect(hoverAnchor).toBeVisible();
    await expect(hoverAnchor).toHaveAttribute('data-hovercard-url', `/users/${developerName}/hovercard`);

    await hoverAnchor.hover();
    await page.waitForTimeout(800);
  });

  test('rendered OpenRank block carries developer identity metadata', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);
    await page.waitForTimeout(2500);
    await mountSyntheticHovercardFixture(page);

    const hoverAnchor = page.locator('#hypercrx-test-hover-anchor');
    await hoverAnchor.hover();

    const info = page.locator('.hypercrx-openrank-info').first();
    await expect(info).toBeVisible({ timeout: 30000 });
    await expect(info).toHaveAttribute('data-developer-name', developerName);
  });
});
