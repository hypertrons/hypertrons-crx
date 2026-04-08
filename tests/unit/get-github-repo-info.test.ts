import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getRepositoryInfo: vi.fn(),
  isRepoRoot: vi.fn(),
  isRepo: vi.fn(),
  metaHas: vi.fn(),
  getPlatform: vi.fn(),
  elementReady: vi.fn(),
}));

vi.mock('github-url-detection', () => ({
  utils: {
    getRepositoryInfo: mocks.getRepositoryInfo,
  },
  isRepoRoot: mocks.isRepoRoot,
  isRepo: mocks.isRepo,
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
  getRepoNameByPage,
  getRepoNameByUrl,
  hasRepoContainerHeader,
  isPublicRepo,
  isPublicRepoWithMeta,
  isRepoRoot,
} from '../../src/helpers/get-github-repo-info';

describe('get-github-repo-info', () => {
  it('gets repo full name from URL detector', () => {
    mocks.getRepositoryInfo.mockReturnValue({ nameWithOwner: 'owner/repo' });
    expect(getRepoNameByUrl()).toBe('owner/repo');
    expect(getRepoName()).toBe('owner/repo');
  });

  it('gets repo full name from header labels', () => {
    document.body.innerHTML =
      '<header><span class="AppHeader-context-item-label">owner</span><span class="AppHeader-context-item-label">repo</span></header>';
    expect(getRepoNameByPage()).toBe('owner/repo');
  });

  it('checks repository container header visibility', () => {
    document.body.innerHTML = '<div id="repository-container-header"></div>';
    expect(hasRepoContainerHeader()).toBe(true);
  });

  it('returns false when repository container header is missing', () => {
    document.body.innerHTML = '<div id="other-header"></div>';
    expect(hasRepoContainerHeader()).toBe(false);
  });

  it('returns false when repository container header is hidden', () => {
    document.body.innerHTML = '<div id="repository-container-header" hidden></div>';
    expect(hasRepoContainerHeader()).toBe(false);
  });

  it('returns public repo status from meta and repo detection', async () => {
    document.head.innerHTML = '<meta name="octolytics-dimension-repository_public" content="true" />';
    mocks.elementReady.mockResolvedValue(true);
    mocks.isRepo.mockReturnValue(true);

    await expect(isPublicRepo()).resolves.toBe(true);
  });

  it('checks public repo with meta store', async () => {
    mocks.getPlatform.mockReturnValue('github');
    mocks.getRepositoryInfo.mockReturnValue({ nameWithOwner: 'owner/repo' });
    document.head.innerHTML = '<meta name="octolytics-dimension-repository_public" content="true" />';
    mocks.elementReady.mockResolvedValue(true);
    mocks.isRepo.mockReturnValue(true);
    mocks.metaHas.mockResolvedValue(true);

    await expect(isPublicRepoWithMeta()).resolves.toBe(true);
  });

  it('forwards repo root detection', async () => {
    mocks.isRepoRoot.mockResolvedValue(true);
    await expect(isRepoRoot()).resolves.toBe(true);
  });
});
