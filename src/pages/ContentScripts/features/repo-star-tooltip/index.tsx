import features from '../../../../feature-manager';
import View from './view';
import { NativePopover } from '../../components/NativePopover';
import { checkLogined } from '../../../../helpers/get-github-developer-info';
import elementReady from 'element-ready';
import { getRepoName, hasRepoContainerHeader, isPublicRepoWithMeta } from '../../../../helpers/get-github-repo-info';
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
const getData = async () => {
  stars = await getStars(platform, repoName);
  meta = (await metaStore.get(platform, repoName)) as RepoMeta;
};

const init = async (): Promise<void> => {
  platform = getPlatform();
  repoName = getRepoName();
  await getData();
  const isLogined = checkLogined();
  const starButtonSelector = isLogined ? 'button[data-ga-click*="star button"]' : 'a[data-hydro-click*="star button"]';
  await elementReady(starButtonSelector);
  // <div data-view-component="true" class="starred BtnGroup flex-1 ml-0">
  // <div data-view-component="true" class="unstarred BtnGroup ml-0 flex-1">
  // No matter the repo is starred or not, the two button are always there
  // Select all star buttons and no more filtering

  const $starButtons = $(starButtonSelector);
  $starButtons.each(function () {
    const placeholderElement = $('<div class="NativePopover" />').appendTo('body')[0];
    createRoot(placeholderElement).render(
      <NativePopover anchor={$(this)} width={280} arrowPosition="top-middle">
        <View stars={stars} meta={meta} />
      </NativePopover>
    );
  });
};

const restore = async () => {};

features.add(featureId, {
  asLongAs: [isGithub, isPublicRepoWithMeta, hasRepoContainerHeader],
  awaitDomReady: false,
  init,
  restore,
});
