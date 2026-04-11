import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  isUserProfile: vi.fn(),
  metaHas: vi.fn(),
  getPlatform: vi.fn(),
}));

vi.mock('github-url-detection', () => ({
  isUserProfile: mocks.isUserProfile,
}));

vi.mock('../../src/api/common', () => ({
  metaStore: {
    has: mocks.metaHas,
  },
}));

vi.mock('../../src/helpers/get-platform', () => ({
  getPlatform: mocks.getPlatform,
}));

import {
  getDeveloperName,
  getDeveloperNameByPage,
  getDeveloperNameByUrl,
  isDeveloperWithMeta,
  isUserProfile,
} from '../../src/helpers/get-gitee-developer-info';

const setLocation = (href: string) => {
  const url = new URL(href);
  Object.defineProperty(window, 'location', {
    value: {
      href: url.href,
      search: url.search,
      pathname: url.pathname,
    },
    configurable: true,
  });
};

describe('get-gitee-developer-info', () => {
  it('parses developer name by page selector', () => {
    document.body.innerHTML = '<div class="users__personal-name"><p>@giteeUser</p></div>';
    expect(getDeveloperNameByPage()).toBe('giteeUser');
  });

  it('parses developer name by URL', () => {
    setLocation('https://gitee.com/giteeUser');
    expect(getDeveloperNameByUrl()).toBe('giteeUser');
  });

  it('uses page name when it matches URL name ignoring case', () => {
    document.body.innerHTML = '<div class="users__personal-name"><p>@GiteeUser</p></div>';
    setLocation('https://gitee.com/giteeuser');

    expect(getDeveloperName()).toBe('GiteeUser');
  });

  it('returns true when user profile and meta exists', async () => {
    document.body.innerHTML = '<div class="users__personal-name"><p>@giteeUser</p></div>';
    setLocation('https://gitee.com/giteeUser');
    mocks.getPlatform.mockReturnValue('gitee');
    mocks.isUserProfile.mockReturnValue(true);
    mocks.metaHas.mockResolvedValue(true);

    await expect(isDeveloperWithMeta()).resolves.toBe(true);
  });

  it('forwards user profile detection helper', async () => {
    mocks.isUserProfile.mockReturnValue(true);
    await expect(isUserProfile()).resolves.toBe(true);
  });
});
