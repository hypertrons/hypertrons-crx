import features from '../../../../feature-manager';
import View, { PRDetail } from './view';
import elementReady from 'element-ready';
import { getRepoName, isPublicRepoWithMeta } from '../../../../helpers/get-gitee-repo-info';
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
import { getPlatform } from '../../../../helpers/get-platform';
import isGitee from '../../../../helpers/is-gitee';
import { GiteeNativePopover } from '../../components/GiteeNativePopover';

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
const getData = async () => {
  PRDetail.PROpened = await getPROpened(platform, repoName);
  PRDetail.PRMerged = await getPRMerged(platform, repoName);
  PRDetail.PRReviews = await getPRReviews(platform, repoName);
  PRDetail.mergedCodeAddition = await getMergedCodeAddition(platform, repoName);
  PRDetail.mergedCodeDeletion = await getMergedCodeDeletion(platform, repoName);
  meta = (await metaStore.get(platform, repoName)) as RepoMeta;
};

const init = async (): Promise<void> => {
  platform = getPlatform();
  repoName = getRepoName();
  await getData();
  if (Object.keys(PRDetail.mergedCodeAddition || {}).length === 0) {
    PRDetail.mergedCodeAddition = null;
  }
  if (Object.keys(PRDetail.mergedCodeDeletion || {}).length === 0) {
    PRDetail.mergedCodeDeletion = null;
  }

  await elementReady('a.item[href*="/pulls"]');
  const $prTab = $('a.item[href*="/pulls"]');
  const placeholderElement = $('<div class="NativePopover" />').appendTo('body')[0];
  createRoot(placeholderElement).render(
    <GiteeNativePopover anchor={$prTab} width={340} arrowPosition="bottom">
      <View currentRepo={repoName} PRDetail={PRDetail} meta={meta} />
    </GiteeNativePopover>
  );
};

const restore = async () => {};

features.add(featureId, {
  asLongAs: [isGitee, isPublicRepoWithMeta],
  awaitDomReady: false,
  init,
  restore,
});
