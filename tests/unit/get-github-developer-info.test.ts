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
  checkLogined,
  getDeveloperName,
  getDeveloperNameByPage,
  getDeveloperNameByUrl,
  isDeveloperWithMeta,
  isUserProfile,
} from '../../src/helpers/get-github-developer-info';

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

describe('get-github-developer-info', () => {
  it('parses developer name by page selector', () => {
    document.body.innerHTML = '<span class="p-nickname vcard-username d-block"> Alice Bob </span>';
    expect(getDeveloperNameByPage()).toBe('Alice');
  });

  it('parses developer name by URL', () => {
    setLocation('https://github.com/octocat');
    expect(getDeveloperNameByUrl()).toBe('octocat');
  });

  it('prefers page name when url/page names are equal ignoring case', () => {
    document.body.innerHTML = '<span class="p-nickname vcard-username d-block"> OctoCat </span>';
    setLocation('https://github.com/octocat');

    expect(getDeveloperName()).toBe('OctoCat');
  });

  it('checks logged-in state from meta tag', () => {
    document.head.innerHTML = '<meta name="user-login" content="octocat" />';
    expect(checkLogined()).toBe(true);
  });

  it('returns true when user profile and meta exists', async () => {
    document.body.innerHTML = '<span class="p-nickname vcard-username d-block"> octocat </span>';
    setLocation('https://github.com/octocat');
    mocks.getPlatform.mockReturnValue('github');
    mocks.isUserProfile.mockReturnValue(true);
    mocks.metaHas.mockResolvedValue(true);

    await expect(isDeveloperWithMeta()).resolves.toBe(true);
  });

  it('forwards user profile detection helper', async () => {
    mocks.isUserProfile.mockReturnValue(true);
    await expect(isUserProfile()).resolves.toBe(true);
  });
});
