import features from '../../../../feature-manager';
import View from './view';
import { NativePopover } from '../../components/NativePopover';
import elementReady from 'element-ready';
import { getRepoName, isPublicRepoWithMeta } from '../../../../helpers/get-github-repo-info';
import { getForks } from '../../../../api/repo';
import { RepoMeta, metaStore } from '../../../../api/common';

import React from 'react';
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import isGithub from '../../../../helpers/is-github';
import { getPlatform } from '../../../../helpers/get-platform';
const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let forks: any;
let meta: RepoMeta;
let platform: string;
const forkButtonSelectors = [
  'a[data-hydro-click*="FORK_BUTTON"]',
  'button[data-hydro-click*="FORK_BUTTON"]',
  '#fork-button',
  '#fork-icon-button',
];

const getData = async () => {
  forks = await getForks(platform, repoName);
  meta = (await metaStore.get(platform, repoName)) as RepoMeta;
};
const getForkButtons = () => {
  return $(forkButtonSelectors.join(',')).filter((_, element) => !element.closest('template'));
};

const init = async (): Promise<void> => {
  platform = getPlatform();
  repoName = getRepoName();
  await getData();

  await elementReady(forkButtonSelectors.join(','));
  const $forkButtons = getForkButtons();

  $forkButtons.each(function (_index, element) {
    const placeholderElement = $('<div class="NativePopover" />').appendTo('body')[0];
    createRoot(placeholderElement).render(
      <NativePopover anchor={$(element)} width={280} arrowPosition="top-middle">
        <View forks={forks} meta={meta} />
      </NativePopover>
    );
  });
};

const restore = async () => {};

features.add(featureId, {
  asLongAs: [isGithub, isPublicRepoWithMeta],
  awaitDomReady: false,
  init,
  restore,
});
