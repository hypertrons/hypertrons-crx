import { metaStore } from '../api/common';

import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import { getPlatform } from './get-platform';
import elementReady from 'element-ready';

export function getRepoName() {
  const repoNameByUrl = getRepoNameByUrl();
  return repoNameByUrl;
}

export function getRepoNameByUrl() {
  return pageDetect.utils.getRepositoryInfo(window.location)!.nameWithOwner;
}
export async function isRepoRoot() {
  return pageDetect.isRepoRoot();
}
export function hasRepoContainerHeader() {
  const headerElement = $('#git-project-header-details');
  return headerElement && !headerElement.attr('hidden');
}

/**
 * check if the repository is public
 */
export async function isPublicRepo() {
  const elements = await elementReady('.gitee-project-extension .extension.public');
  if (!elements) {
    return false;
  }
  return $(elements).text().trim() === '1';
}
export async function isPublicRepoWithMeta() {
  const platform = getPlatform();
  if (platform === 'unknown') {
    return false;
  }
  return (await isPublicRepo()) && (await metaStore.has(platform, getRepoNameByUrl()));
}
