import { hasMeta } from '../api/common';

import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import elementReady from 'element-ready';

export function getRepoName() {
  return pageDetect.utils.getRepositoryInfo(window.location)!.nameWithOwner;
}

// check if the repository is public
export async function isPublicRepo() {
  // another selector that also works
  // const repoLabel = $('strong[itemprop="name"]').siblings('span.Label.Label--secondary').text();
  await elementReady('#repository-container-header');
  const repoLabel = $('#repository-container-header')
    .find('span.Label.Label--secondary:first')
    .text();
  return (
    pageDetect.isRepo() &&
    (repoLabel === 'Public' || repoLabel === 'Public template')
  );
}

export async function isPublicRepoWithMeta() {
  return (await isPublicRepo()) && (await hasMeta(getRepoName()));
}
