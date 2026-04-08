import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getRepositoryInfo: vi.fn(),
  isRepoRoot: vi.fn(),
  metaHas: vi.fn(),
  getPlatform: vi.fn(),
  elementReady: vi.fn(),
}));

vi.mock('github-url-detection', () => ({
  utils: {
    getRepositoryInfo: mocks.getRepositoryInfo,
  },
  isRepoRoot: mocks.isRepoRoot,
}));

vi.mock('element-ready', () => ({
  default: mocks.elementReady,
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
  getRepoName,
  getRepoNameByUrl,
  hasRepoContainerHeader,
  isPublicRepo,
  isPublicRepoWithMeta,
  isRepoRoot,
} from '../../src/helpers/get-gitee-repo-info';

describe('get-gitee-repo-info', () => {
  it('gets repo name from URL detector', () => {
    mocks.getRepositoryInfo.mockReturnValue({ nameWithOwner: 'owner/repo' });
    expect(getRepoNameByUrl()).toBe('owner/repo');
    expect(getRepoName()).toBe('owner/repo');
  });

  it('checks gitee repository header visibility', () => {
    document.body.innerHTML = '<div id="git-project-header-details"></div>';
    expect(hasRepoContainerHeader()).toBe(true);
  });

  it('returns false when gitee repository header is missing', () => {
    document.body.innerHTML = '<div id="other-header"></div>';
    expect(hasRepoContainerHeader()).toBe(false);
  });

  it('returns false when gitee repository header is hidden', () => {
    document.body.innerHTML = '<div id="git-project-header-details" hidden></div>';
    expect(hasRepoContainerHeader()).toBe(false);
  });

  it('returns false for non-public repository marker', async () => {
    const element = document.createElement('span');
    element.textContent = '0';
    mocks.elementReady.mockResolvedValue(element);

    await expect(isPublicRepo()).resolves.toBe(false);
  });

  it('checks public repo with meta store', async () => {
    const element = document.createElement('span');
    element.textContent = '1';
    mocks.elementReady.mockResolvedValue(element);
    mocks.getPlatform.mockReturnValue('gitee');
    mocks.getRepositoryInfo.mockReturnValue({ nameWithOwner: 'owner/repo' });
    mocks.metaHas.mockResolvedValue(true);

    await expect(isPublicRepoWithMeta()).resolves.toBe(true);
  });

  it('forwards repo root detection', async () => {
    mocks.isRepoRoot.mockResolvedValue(true);
    await expect(isRepoRoot()).resolves.toBe(true);
  });
});
