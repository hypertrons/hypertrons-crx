import features from '../../../../feature-manager';
import View, { PRDetail } from './view';
import { NativePopover } from '../../components/NativePopover';
import elementReady from 'element-ready';
import { getRepoName, isPublicRepoWithMeta } from '../../../../helpers/get-github-repo-info';
import { createRoot } from 'react-dom/client';
import {
  getPROpened,
  getPRMerged,
  getPRReviews,
  getMergedCodeAddition,
  getMergedCodeDeletion,
} from '../../../../api/repo';
import { RepoMeta, metaStore } from '../../../../api/common';

import React from 'react';
import $ from 'jquery';
import isGithub from '../../../../helpers/is-github';
import { getPlatform } from '../../../../helpers/get-platform';

const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let PRDetail: PRDetail = {
  PROpened: null,
  PRMerged: null,
  PRReviews: null,
  mergedCodeAddition: null,
  mergedCodeDeletion: null,
};
let meta: RepoMeta;
let platform: string;
const pullRequestTabSelector = 'a[data-tab-item="pull-requests"]';
const pullRequestFallbackSelectors = ['#pull-requests-tab', 'a[href$="/pulls"][data-selected-links*="repo_pulls"]'];

const getData = async () => {
  PRDetail.PROpened = await getPROpened(platform, repoName);
  PRDetail.PRMerged = await getPRMerged(platform, repoName);
  PRDetail.PRReviews = await getPRReviews(platform, repoName);
  PRDetail.mergedCodeAddition = await getMergedCodeAddition(platform, repoName);
  PRDetail.mergedCodeDeletion = await getMergedCodeDeletion(platform, repoName);
  meta = (await metaStore.get(platform, repoName)) as RepoMeta;
};
const getPullRequestTab = () => {
  const $primaryTabs = $(pullRequestTabSelector).filter((_, element) => !element.closest('template'));
  const $visiblePrimaryTabs = $primaryTabs.filter(':visible');
  if ($visiblePrimaryTabs.length > 0 || $primaryTabs.length > 0) {
    return ($visiblePrimaryTabs.length > 0 ? $visiblePrimaryTabs : $primaryTabs).first();
  }

  const $tabs = $(pullRequestFallbackSelectors.join(',')).filter((_, element) => !element.closest('template'));
  const $visibleTabs = $tabs.filter(':visible');

  return ($visibleTabs.length > 0 ? $visibleTabs : $tabs).first();
};

const init = async (): Promise<void> => {
  platform = getPlatform();
  repoName = getRepoName();
  await getData();
  await elementReady([pullRequestTabSelector, ...pullRequestFallbackSelectors].join(','));
  const $prTab = getPullRequestTab();
  if ($prTab.length === 0) {
    return;
  }
  const placeholderElement = $('<div class="NativePopover" />').appendTo('body')[0];
  createRoot(placeholderElement).render(
    <NativePopover anchor={$prTab} width={340} arrowPosition="top-middle">
      <View currentRepo={repoName} PRDetail={PRDetail} meta={meta} />
    </NativePopover>
  );
};

const restore = async () => {};

features.add(featureId, {
  asLongAs: [isGithub, isPublicRepoWithMeta],
  awaitDomReady: false,
  init,
  restore,
});
