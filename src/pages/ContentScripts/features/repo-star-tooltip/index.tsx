import features from '../../../../feature-manager';
import View from './view';
import { NativePopover } from '../../components/NativePopover';
import { checkLogined } from '../../../../helpers/get-developer-info';
import elementReady from 'element-ready';
import { getRepoName, hasRepoContainerHeader, isPublicRepoWithMeta } from '../../../../helpers/get-repo-info';
import { getStars } from '../../../../api/repo';
import { RepoMeta, metaStore } from '../../../../api/common';

import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';

const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let stars: any;
let meta: RepoMeta;

const getData = async () => {
  stars = await getStars(repoName);
  meta = (await metaStore.get(repoName)) as RepoMeta;
};

const init = async (): Promise<void> => {
  repoName = getRepoName();
  await getData();
  const isLogined = checkLogined();
  const starButtonSelector = isLogined ? 'button[data-ga-click*="star button"]' : 'a[data-hydro-click*="star button"]';
  await elementReady(starButtonSelector);
  // <div data-view-component="true" class="starred BtnGroup flex-1 ml-0">
  // <div data-view-component="true" class="unstarred BtnGroup ml-0 flex-1">
  // No matter the repo is starred or not, the two button are always there
  // So we need to filter the visible one
  const $starButton = $(starButtonSelector).filter(function () {
    if ($(this).parent().parent().css('display') !== 'none') {
      return true;
    } else {
      return false;
    }
  });
  const placeholderElement = $('<div class="NativePopover" />').appendTo('body')[0];
  render(
    <NativePopover anchor={$starButton} width={280} arrowPosition="top-middle">
      <View stars={stars} meta={meta} />
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
