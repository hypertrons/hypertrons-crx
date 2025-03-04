import features from '../../../../feature-manager';
import View from './view';
import elementReady from 'element-ready';
import { getRepoName, hasRepoContainerHeader, isPublicRepoWithMeta } from '../../../../helpers/get-gitee-repo-info';
import { getForks } from '../../../../api/repo';
import { RepoMeta, metaStore } from '../../../../api/common';

import React from 'react';
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import isGitee from '../../../../helpers/is-gitee';
import { getPlatform } from '../../../../helpers/get-platform';
import { GiteeNativePopover } from '../../components/GiteeNativePopover';
const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let forks: any;
let meta: RepoMeta;
let platform: string;
const getData = async () => {
  forks = await getForks(platform, repoName);
  meta = (await metaStore.get(platform, repoName)) as RepoMeta;
};

const init = async (): Promise<void> => {
  platform = getPlatform();
  repoName = getRepoName();
  await getData();

  const forkButtonSelector = '.fork-container';
  await elementReady(forkButtonSelector);
  const $forkButton = $(forkButtonSelector);
  const placeholderElement = $('<div class="NativePopover" />').appendTo('body')[0];
  createRoot(placeholderElement).render(
    <GiteeNativePopover anchor={$forkButton} width={280} arrowPosition="bottom">
      <View forks={forks} meta={meta} />
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
