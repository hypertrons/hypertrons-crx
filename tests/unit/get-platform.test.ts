import { describe, expect, it, vi } from 'vitest';

vi.mock('../../src/helpers/is-github', () => ({
  default: vi.fn(),
}));

vi.mock('../../src/helpers/is-gitee', () => ({
  default: vi.fn(),
}));

import { getPlatform } from '../../src/helpers/get-platform';
import isGithub from '../../src/helpers/is-github';
import isGitee from '../../src/helpers/is-gitee';

const mockedIsGithub = vi.mocked(isGithub);
const mockedIsGitee = vi.mocked(isGitee);

describe('getPlatform', () => {
  it('returns github when github matcher is true', () => {
    mockedIsGithub.mockReturnValue(true);
    mockedIsGitee.mockReturnValue(false);

    expect(getPlatform()).toBe('github');
  });

  it('returns gitee when only gitee matcher is true', () => {
    mockedIsGithub.mockReturnValue(false);
    mockedIsGitee.mockReturnValue(true);

    expect(getPlatform()).toBe('gitee');
  });

  it('returns unknown when both matchers are false', () => {
    mockedIsGithub.mockReturnValue(false);
    mockedIsGitee.mockReturnValue(false);

    expect(getPlatform()).toBe('unknown');
  });
});
