import { beforeEach, describe, expect, it, vi } from 'vitest';

const loadCommonWithRequestMock = async (requestImpl: (...args: unknown[]) => unknown) => {
  vi.resetModules();
  vi.doMock('../../src/helpers/request', () => ({
    default: vi.fn(requestImpl),
  }));

  return await import('../../src/api/common');
};

describe('getMetricByName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns request payload on success', async () => {
    const module = await loadCommonWithRequestMock(async () => ({ score: 42 }));
    const metricNameMap = new Map<string, string>([['star', 'star_metric']]);

    await expect(module.getMetricByName('github', 'owner/repo', metricNameMap, 'star')).resolves.toEqual({ score: 42 });
  });

  it('returns null when request throws 404', async () => {
    const module = await loadCommonWithRequestMock(async () => {
      throw 404;
    });
    const metricNameMap = new Map<string, string>([['star', 'star_metric']]);

    await expect(module.getMetricByName('github', 'owner/repo', metricNameMap, 'star')).resolves.toBeNull();
  });

  it('rethrows non-404 errors', async () => {
    const module = await loadCommonWithRequestMock(async () => {
      throw 500;
    });
    const metricNameMap = new Map<string, string>([['star', 'star_metric']]);

    await expect(module.getMetricByName('github', 'owner/repo', metricNameMap, 'star')).rejects.toBe(500);
  });
});

describe('metaStore', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('has() returns true for successful response and caches fetch by name', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    const { metaStore } = await import('../../src/api/common');

    await expect(metaStore.has('github', 'owner/repo')).resolves.toBe(true);
    await expect(metaStore.has('github', 'owner/repo')).resolves.toBe(true);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('has() returns false for unsuccessful response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
      })
    );

    const { metaStore } = await import('../../src/api/common');

    await expect(metaStore.has('github', 'owner/repo')).resolves.toBe(false);
  });

  it('get() returns parsed meta when response exists', async () => {
    const jsonPayload = { type: 'repo', updatedAt: 123 };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        clone: () => ({
          json: async () => jsonPayload,
        }),
      })
    );

    const { metaStore } = await import('../../src/api/common');

    await expect(metaStore.get('github', 'owner/repo')).resolves.toEqual(jsonPayload);
  });

  it('get() returns undefined when response does not exist', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
      })
    );

    const { metaStore } = await import('../../src/api/common');

    await expect(metaStore.get('github', 'owner/repo')).resolves.toBeUndefined();
  });
});
