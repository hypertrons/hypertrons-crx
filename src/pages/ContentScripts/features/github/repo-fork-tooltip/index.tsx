import features from '../../../../../feature-manager';
import View from './view';
import { NativePopover } from '../../../components/NativePopover';
import elementReady from 'element-ready';
import { getRepoName, hasRepoContainerHeader, isPublicRepoWithMeta } from '../../../../../helpers/get-repo-info';
import { getForks } from '../../../../../api/repo';
import { RepoMeta, metaStore } from '../../../../../api/common';

import React from 'react';
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import isGithub from '../../../../../helpers/is-github';
import { getPlatform } from '../../../../../helpers/platform-detection';

const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let forks: any;
let meta: RepoMeta;

const getData = async () => {
  const platform = getPlatform();
  forks = await getForks(platform, repoName);
  meta = (await metaStore.get(platform, repoName)) as RepoMeta;
};

const init = async (): Promise<void> => {
  repoName = getRepoName();
  await getData();

  const forkButtonSelector = '#fork-button';
  await elementReady(forkButtonSelector);
  const $forkButton = $(forkButtonSelector);
  const placeholderElement = $('<div class="NativePopover" />').appendTo('body')[0];
  createRoot(placeholderElement).render(
    <NativePopover anchor={$forkButton} width={280} arrowPosition="top-middle">
      <View forks={forks} meta={meta} />
    </NativePopover>
  );
};

const restore = async () => {};

features.add(featureId, {
  asLongAs: [isGithub, () => isPublicRepoWithMeta(getPlatform()), hasRepoContainerHeader],
  awaitDomReady: false,
  init,
  restore,
});
