import { expect, test, type BrowserContext } from '@playwright/test';
import { cleanupExtensionContext, gotoPublicRepo, launchExtensionContext } from './helpers';

test.describe('content script component: fast-pr', () => {
  let context: BrowserContext;
  let userDataDir: string;

  test.beforeAll(async () => {
    const launched = await launchExtensionContext('hypercrx-e2e-content-fast-pr-');
    context = launched.context;
    userDataDir = launched.userDataDir;
  });

  test.afterAll(async () => {
    await cleanupExtensionContext(context, userDataDir);
  });

  test('injects hidden sandbox iframe for fast-pr matching workflow', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);

    const sandboxFrame = page.locator('iframe#sandboxFrame');
    await expect(sandboxFrame).toHaveCount(1);
    await expect(sandboxFrame).toHaveAttribute('src', /sandbox\.html/);
  });

  test('renders floating fast-pr action after matchedUrl message', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);

    await page.evaluate(() => {
      window.postMessage(
        {
          matchedUrl: {
            filePath: 'README.md',
            repoName: 'hypertrons/hypertrons-crx',
            branch: 'master',
            platform: 'Github',
            horizontalRatio: 0.86,
            verticalRatio: 0.84,
          },
        },
        '*'
      );
    });

    const featureRoot = page.locator('#hypercrx-fast-pr');
    await expect(featureRoot).toHaveCount(1);
    await expect(featureRoot.locator('.ant-float-btn')).toHaveCount(1);
  });

  test('updates fast-pr cache when sandbox update message is received', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);

    await page.evaluate(() => {
      localStorage.removeItem('matchedUrlCache');
      window.postMessage(
        {
          matchedFun: 'matched-by-rule',
          isUpdated: true,
        },
        '*'
      );
    });

    await expect
      .poll(async () => {
        return page.evaluate(() => {
          const value = localStorage.getItem('matchedUrlCache');
          if (!value) return null;
          const parsed = JSON.parse(value);
          return parsed.matchedFun;
        });
      })
      .toBe('matched-by-rule');
  });
});
