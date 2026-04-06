import { expect, test, type BrowserContext } from '@playwright/test';
import { cleanupExtensionContext, gotoPublicRepo, launchExtensionContext } from './helpers';

test.describe('content script component: repo header labels', () => {
  let context: BrowserContext;
  let userDataDir: string;

  test.beforeAll(async () => {
    const launched = await launchExtensionContext('hypercrx-e2e-content-header-');
    context = launched.context;
    userDataDir = launched.userDataDir;
  });

  test.afterAll(async () => {
    await cleanupExtensionContext(context, userDataDir);
  });

  test('renders the three header labels on a public GitHub repository page', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);

    const headerLabels = page.locator('.hypercrx-inline-label-container .hypercrx-repo-header-label');
    await expect(headerLabels).toHaveCount(3);
    await expect(page.locator('#activity-header-label')).toHaveCount(1);
    await expect(page.locator('#OpenRank-header-label')).toHaveCount(1);
    await expect(page.locator('#participant-header-label')).toHaveCount(1);
  });

  test('activity header label opens a tooltip on hover', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);

    const activityLabel = page.locator('#activity-header-label');
    await expect(activityLabel).toBeVisible();

    await activityLabel.hover();
    await expect(page.locator('div.Popover.js-hovercard-content')).toBeVisible();
    await expect(page.locator('div.Popover.js-hovercard-content')).toContainText('Activity');
  });

  test('openrank header label opens a tooltip on hover', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);

    const openrankLabel = page.locator('#OpenRank-header-label');
    await expect(openrankLabel).toBeVisible();

    await openrankLabel.hover();
    await expect(page.locator('div.Popover.js-hovercard-content')).toBeVisible();
    await expect(page.locator('div.Popover.js-hovercard-content')).toContainText('OpenRank');
  });

  test('participant header label opens a tooltip on hover', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);

    const participantLabel = page.locator('#participant-header-label');
    await expect(participantLabel).toBeVisible();

    await participantLabel.hover();
    await expect(page.locator('div.Popover.js-hovercard-content')).toBeVisible();
    await expect(page.locator('div.Popover.js-hovercard-content')).toContainText('Contributor');
  });
});
