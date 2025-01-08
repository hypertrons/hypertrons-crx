import features from '../../../../feature-manager';
import View, { PRDetail } from './view';
import { NativePopover } from '../../components/NativePopover';
import elementReady from 'element-ready';
import { getRepoName, isPublicRepoWithMeta } from '../../../../helpers/get-repo-info';
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

  await elementReady('#pull-requests-tab');
  const $prTab = $('#pull-requests-tab');
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
