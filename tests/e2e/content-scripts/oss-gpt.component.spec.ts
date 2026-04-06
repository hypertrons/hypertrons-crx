import { expect, test, type BrowserContext } from '@playwright/test';
import { cleanupExtensionContext, gotoPublicRepo, launchExtensionContext } from './helpers';

test.describe('content script component: oss-gpt', () => {
  let context: BrowserContext;
  let userDataDir: string;

  const enableOssGptFeature = async () => {
    const serviceWorker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
    const extensionId = new URL(serviceWorker.url()).host;

    const optionsPage = await context.newPage();
    await optionsPage.goto(`chrome-extension://${extensionId}/options.html`, { waitUntil: 'domcontentloaded' });

    const checkbox = optionsPage.getByRole('checkbox', { name: 'oss-gpt' });
    await expect(checkbox).toBeVisible();
    if (!(await checkbox.isChecked())) {
      await checkbox.click();
    }
    await expect(checkbox).toBeChecked();
    await optionsPage.close();
  };

  test.beforeAll(async () => {
    const launched = await launchExtensionContext('hypercrx-e2e-content-oss-gpt-');
    context = launched.context;
    userDataDir = launched.userDataDir;

    await context.route('https://oss.x-lab.info/hypercrx/docsgpt_active_docs.json', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            type: 'repo',
            name: 'hypertrons/hypertrons-crx',
            key: 'hypercrx-docs',
          },
        ]),
      });
    });

    await enableOssGptFeature();
  });

  test.afterAll(async () => {
    await cleanupExtensionContext(context, userDataDir);
  });

  test('mounts OSS-GPT container on public GitHub repository pages', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);

    const featureRoot = page.locator('#hypercrx-oss-gpt');
    await expect(featureRoot).toHaveCount(1);
    await expect(featureRoot).toHaveAttribute('data-repo', 'hypertrons/hypertrons-crx');
  });

  test('renders chat widget launcher and title', async () => {
    const page = await context.newPage();
    await gotoPublicRepo(page);

    const featureRoot = page.locator('#hypercrx-oss-gpt');
    await expect(featureRoot).toHaveCount(1);

    const launcher = page.locator('#hypercrx-oss-gpt button.rcw-launcher');
    await expect(launcher).toHaveCount(1);

    await launcher.click();
    await expect(page.locator('#hypercrx-oss-gpt .rcw-title')).toContainText('OSS-GPT');
  });

  test('does not render OSS-GPT on non-github pages', async () => {
    const page = await context.newPage();
    await page.goto('https://example.com', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    await expect(page.locator('#hypercrx-oss-gpt')).toHaveCount(0);
  });
});
