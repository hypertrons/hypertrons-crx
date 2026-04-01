import { beforeEach, describe, expect, it, vi } from 'vitest';

type LoadOptions = {
  featureEnabled?: boolean;
  shouldRun?: boolean;
  is404?: boolean;
  isRestorationVisit?: boolean;
};

const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

const loadFeatureManager = async (opts: LoadOptions = {}) => {
  const { featureEnabled = true, shouldRun = true, is404 = false, isRestorationVisit = false } = opts;

  vi.resetModules();

  const shouldFeatureRunMock = vi.fn().mockResolvedValue(shouldRun);
  const optionsGetAllMock = vi.fn().mockResolvedValue({
    'hypercrx-test-feature': featureEnabled,
  });
  const isRestorationVisitMock = vi.fn(() => isRestorationVisit);

  vi.doMock('dom-loaded', () => ({ default: Promise.resolve() }));
  vi.doMock('lodash-es', () => ({
    throttle: (fn: (...args: unknown[]) => unknown) => fn,
  }));
  vi.doMock('github-url-detection', () => {
    const is404Fn = vi.fn(() => is404);
    return {
      is500: vi.fn(() => false),
      isPasswordConfirmation: vi.fn(() => false),
      is404: is404Fn,
    };
  });
  vi.doMock('../../src/helpers/should-feature-run', () => ({
    default: shouldFeatureRunMock,
  }));
  vi.doMock('../../src/options-storage', () => ({
    default: {
      getAll: optionsGetAllMock,
    },
  }));
  vi.doMock('../../src/helpers/wait-for', () => ({
    default: vi.fn(async () => undefined),
  }));
  vi.doMock('../../src/helpers/sleep', () => ({
    default: vi.fn(async () => undefined),
  }));
  vi.doMock('../../src/helpers/is-restoration-visit', () => ({
    default: isRestorationVisitMock,
  }));
  vi.doMock('../../src/helpers/exists', () => ({
    default: (selector: string) => !!document.querySelector(selector),
  }));

  const module = await import('../../src/feature-manager');

  return {
    features: module.default,
    shouldFeatureRunMock,
    optionsGetAllMock,
    isRestorationVisitMock,
  };
};

describe('feature-manager integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.className = '';
    vi.clearAllMocks();
  });

  it('runs init when feature is enabled and conditions pass', async () => {
    const { features, shouldFeatureRunMock } = await loadFeatureManager({
      featureEnabled: true,
      shouldRun: true,
    });
    const init = vi.fn(async () => undefined);

    await features.add('hypercrx-test-feature', {
      init,
      awaitDomReady: false,
    });
    await flush();

    expect(shouldFeatureRunMock).toHaveBeenCalledTimes(1);
    expect(init).toHaveBeenCalledTimes(1);
  });

  it('skips init when feature is disabled in options', async () => {
    const { features, shouldFeatureRunMock } = await loadFeatureManager({
      featureEnabled: false,
      shouldRun: true,
    });
    const init = vi.fn(async () => undefined);

    await features.add('hypercrx-test-feature', {
      init,
      awaitDomReady: false,
    });
    await flush();

    expect(shouldFeatureRunMock).not.toHaveBeenCalled();
    expect(init).not.toHaveBeenCalled();
  });

  it('throws when include is an empty array', async () => {
    const { features } = await loadFeatureManager();

    await expect(
      features.add('hypercrx-test-feature', {
        init: vi.fn(async () => undefined),
        include: [],
      })
    ).rejects.toThrow('`include` cannot be an empty array');
  });

  it('calls restore on turbo:render during restoration visits when feature node exists', async () => {
    const { features } = await loadFeatureManager({
      featureEnabled: true,
      shouldRun: true,
      isRestorationVisit: true,
    });
    const init = vi.fn(async () => undefined);
    const restore = vi.fn();

    const existingNode = document.createElement('div');
    existingNode.id = 'hypercrx-test-feature';
    document.body.appendChild(existingNode);

    await features.add('hypercrx-test-feature', {
      init,
      restore,
      awaitDomReady: false,
    });

    document.dispatchEvent(new Event('turbo:render'));
    await flush();

    expect(restore).toHaveBeenCalledTimes(1);
  });

  it('extracts feature id from entry file URL patterns', async () => {
    const { features } = await loadFeatureManager();

    expect(features.getFeatureID('/foo/bar/repo-networks.tsx')).toBe('hypercrx-repo-networks');
    expect(features.getFeatureID('/foo/bar/repo-networks/index.tsx')).toBe('hypercrx-repo-networks');
    expect(features.getFeatureID('/foo/bar/repo-networks/gitee-index.tsx')).toBe('hypercrx-repo-networks');
  });
});
