import { describe, expect, it } from 'vitest';
import { getGithubToken, removeGithubToken, saveGithubToken } from '../../src/helpers/github-token';

describe('github-token helper', () => {
  it('saves and reads token from chrome storage', async () => {
    await saveGithubToken('ghp_test_token');

    await expect(getGithubToken()).resolves.toBe('ghp_test_token');
  });

  it('removes token from chrome storage', async () => {
    await saveGithubToken('ghp_test_token');
    await removeGithubToken();

    await expect(getGithubToken()).resolves.toBeNull();
  });
});
