import { metaStore } from '../api/common';

import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import elementReady from 'element-ready';

export function getRepoName() {
  return pageDetect.utils.getRepositoryInfo(window.location)!.nameWithOwner;
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
  return (await isPublicRepo()) && (await metaStore.has(getRepoName()));
}
export function getUsername() {
  return pageDetect.utils.getUsername();
}
