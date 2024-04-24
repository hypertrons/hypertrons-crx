import features from '../../../../feature-manager';
import View from './view';
import { NativePopover } from '../../components/NativePopover';
import { checkLogined } from '../../../../helpers/get-developer-info';
import elementReady from 'element-ready';
import {
  getRepoName,
  hasRepoContainerHeader,
  isPublicRepoWithMeta,
} from '../../../../helpers/get-repo-info';
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
  const starButtonSelector = isLogined
    ? 'button[data-ga-click*="star button"]'
    : 'a[data-hydro-click*="star button"]';
  await elementReady(starButtonSelector);
  const $starButton = $(starButtonSelector);
  const placeholderElement = $('<div class="NativePopover" />').appendTo(
    'body'
  )[0];
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
