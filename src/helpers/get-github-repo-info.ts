import { metaStore } from '../api/common';

import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import elementReady from 'element-ready';
import { getPlatform } from './get-platform';

export function getRepoName() {
  const repoNameByUrl = getRepoNameByUrl();
  const repoNameByPage = getRepoNameByPage();
  if (repoNameByUrl.toLowerCase() === repoNameByPage.toLowerCase()) {
    return repoNameByPage;
  }
  return repoNameByUrl;
}

export function getRepoNameByPage() {
  let repoName: string[] = [];
  $('header span.AppHeader-context-item-label').map(function () {
    repoName.push($(this).text().trim());
  });
  let repoFullName = repoName[0] + '/' + repoName[1];
  return repoFullName;
}

export function getRepoNameByUrl() {
  const repoInfo = pageDetect.utils.getRepositoryInfo(window.location);
  if (!repoInfo) {
    return '';
  }
  return repoInfo.nameWithOwner;
}

export function hasRepoContainerHeader() {
  const headerElement = $('#repository-container-header');
  return headerElement && !headerElement.attr('hidden');
}

export async function isRepoRoot() {
  return pageDetect.isRepoRoot();
}

/**
 * check if the repository is public
 */
export async function isPublicRepo() {
  const selector = 'meta[name="octolytics-dimension-repository_public"]';
  await elementReady(selector);
  // <meta name="octolytics-dimension-repository_public" content="true/false">
  const isPublic = $(selector).attr('content') === 'true';
  return pageDetect.isRepo() && isPublic;
}
export async function isPublicRepoWithMeta() {
  const platform = getPlatform();
  if (platform === 'unknown') {
    return false;
  }
  return (
    (await isPublicRepo()) &&
    ((await metaStore.has(platform, getRepoNameByUrl())) || (await metaStore.has(platform, getRepoNameByPage())))
  );
}
