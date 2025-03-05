import { metaStore } from '../api/common';

import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import { getPlatform } from './get-platform';

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
  const elements = $('.project-icon.iconfont');
  return elements.hasClass('icon-project-public');
}
export async function isPublicRepoWithMeta() {
  const platform = getPlatform();
  if (platform === 'unknown') {
    return false;
  }
  return (await isPublicRepo()) && (await metaStore.has(platform, getRepoNameByUrl()));
}
