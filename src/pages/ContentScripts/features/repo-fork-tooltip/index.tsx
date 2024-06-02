import features from '../../../../feature-manager';
import View from './view';
import { NativePopover } from '../../components/NativePopover';
import elementReady from 'element-ready';
import { getRepoName, hasRepoContainerHeader, isPublicRepoWithMeta } from '../../../../helpers/get-repo-info';
import { getForks } from '../../../../api/repo';
import { RepoMeta, metaStore } from '../../../../api/common';

import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';

const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let forks: any;
let meta: RepoMeta;

const getData = async () => {
  forks = await getForks(repoName);
  meta = (await metaStore.get(repoName)) as RepoMeta;
};

const init = async (): Promise<void> => {
  repoName = getRepoName();
  await getData();

  const forkButtonSelector = '#fork-button';
  await elementReady(forkButtonSelector);
  const $forkButton = $(forkButtonSelector);
  const placeholderElement = $('<div class="NativePopover" />').appendTo('body')[0];
  render(
    <NativePopover anchor={$forkButton} width={280} arrowPosition="top-middle">
      <View forks={forks} meta={meta} />
    </NativePopover>,
    placeholderElement
  );
};

const restore = async () => {};

features.add(featureId, {
  asLongAs: [isPublicRepoWithMeta, hasRepoContainerHeader],
  awaitDomReady: false,
  init,
  restore,
});
