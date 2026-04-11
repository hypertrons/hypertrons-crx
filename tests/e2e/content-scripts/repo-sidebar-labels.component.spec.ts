import { expect, test, type BrowserContext } from '@playwright/test';
import { cleanupExtensionContext, gotoPublicRepo, launchExtensionContext } from './helpers';

test.describe('content script component: repo sidebar labels', () => {
  let context: BrowserContext;
  let userDataDir: string;

  test.beforeAll(async () => {
    const launched = await launchExtensionContext('hypercrx-e2e-content-sidebar-');
    context = launched.context;
    userDataDir = launched.userDataDir;
  });

  test.afterAll(async () => {
    await cleanupExtensionContext(context, userDataDir);
  });

  test('renders OpenDigger labels in repository sidebar', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);

    const labels = page.locator('a[id^="opendigger-label-"]');
    await expect(labels.first()).toBeVisible();
    expect(await labels.count()).toBeGreaterThan(0);
  });

  test('sidebar labels link to OpenDigger and are interactive', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);

    const firstLabel = page.locator('a[id^="opendigger-label-"]').first();
    await expect(firstLabel).toBeVisible();
    await expect(firstLabel).toHaveAttribute('href', /https:\/\/open-digger\.cn/);
    await expect(firstLabel).toHaveAttribute('target', '_blank');

    const labelText = await firstLabel.textContent();
    expect((labelText ?? '').trim().length).toBeGreaterThan(0);
  });
});
