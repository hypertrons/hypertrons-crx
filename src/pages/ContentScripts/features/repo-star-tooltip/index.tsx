import features from '../../../../feature-manager';
import View from './view';
import { NativePopover } from '../../components/NativePopover';
import elementReady from 'element-ready';
import { getRepoName, isPublicRepoWithMeta } from '../../../../helpers/get-github-repo-info';
import { getStars } from '../../../../api/repo';
import { RepoMeta, metaStore } from '../../../../api/common';
import { createRoot } from 'react-dom/client';
import React from 'react';
import $ from 'jquery';
import isGithub from '../../../../helpers/is-github';
import { getPlatform } from '../../../../helpers/get-platform';
const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let stars: any;
let meta: RepoMeta;
let platform: string;
const starButtonSelectors = [
  'button[data-hydro-click*="STAR_BUTTON"]',
  'button[data-hydro-click*="UNSTAR_BUTTON"]',
  'button[data-ga-click*="star button"]',
  'a[data-hydro-click*="star button"]',
  'a[data-ga-click*="star button"]',
];

const getData = async () => {
  stars = await getStars(platform, repoName);
  meta = (await metaStore.get(platform, repoName)) as RepoMeta;
};
const getStarButtons = () => {
  return $(starButtonSelectors.join(',')).filter((_, element) => !element.closest('template'));
};

const init = async (): Promise<void> => {
  platform = getPlatform();
  repoName = getRepoName();
  await getData();
  await elementReady(starButtonSelectors.join(','));
  const $starButtons = getStarButtons();

  $starButtons.each(function (_index, element) {
    const placeholderElement = $('<div class="NativePopover" />').appendTo('body')[0];
    createRoot(placeholderElement).render(
      <NativePopover anchor={$(element)} width={280} arrowPosition="top-middle">
        <View stars={stars} meta={meta} />
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
