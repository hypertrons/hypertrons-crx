import features from '../../../../feature-manager';
import View from './view';
import elementReady from 'element-ready';
import { getRepoName, hasRepoContainerHeader, isPublicRepoWithMeta } from '../../../../helpers/get-gitee-repo-info';
import { getStars } from '../../../../api/repo';
import { RepoMeta, metaStore } from '../../../../api/common';
import { createRoot } from 'react-dom/client';
import React from 'react';
import $ from 'jquery';
import { getPlatform } from '../../../../helpers/get-platform';
import isGitee from '../../../../helpers/is-gitee';
import { GiteeNativePopover } from '../../components/GiteeNativePopover';
const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let stars: any;
let meta: RepoMeta;
let platform: string;
const getData = async () => {
  stars = await getStars(platform, repoName);
  meta = (await metaStore.get(platform, repoName)) as RepoMeta;
};

const init = async (): Promise<void> => {
  platform = getPlatform();
  repoName = getRepoName();
  await getData();

  await elementReady('.star-container .button');
  const $starButtons = $('.star-container');
  const placeholderElement = $('<div class="NativePopover" />').appendTo('body')[0];
  createRoot(placeholderElement).render(
    <GiteeNativePopover anchor={$starButtons} width={280} arrowPosition="bottom">
      <View stars={stars} meta={meta} />
    </GiteeNativePopover>
  );
};
const restore = async () => {};

features.add(featureId, {
  asLongAs: [isGitee, isPublicRepoWithMeta, hasRepoContainerHeader],
  awaitDomReady: false,
  init,
  restore,
});
