import { describe, expect, it, vi } from 'vitest';
import { getGiteeToken, saveGiteeToken } from '../../src/helpers/gitee-token';

describe('gitee-token helper', () => {
  it('returns null when token does not exist', async () => {
    await expect(getGiteeToken()).resolves.toBeNull();
  });

  it('returns existing token when not expired', async () => {
    await saveGiteeToken('gitee_valid', Date.now() + 60_000, 'refresh_1');

    await expect(getGiteeToken()).resolves.toBe('gitee_valid');
  });

  it('refreshes token when expired and stores new value', async () => {
    await saveGiteeToken('gitee_old', Date.now() - 1, 'refresh_old');

    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        access_token: 'gitee_new',
        expires_in: 3600,
        refresh_token: 'refresh_new',
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(getGiteeToken()).resolves.toBe('gitee_new');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await expect(getGiteeToken()).resolves.toBe('gitee_new');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('returns null when refresh endpoint returns empty payload', async () => {
    await saveGiteeToken('gitee_old', Date.now() - 1, 'refresh_old');

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(null),
      })
    );

    await expect(getGiteeToken()).resolves.toBeNull();
  });
});
