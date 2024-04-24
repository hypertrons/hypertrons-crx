import features from '../../../../feature-manager';
import View from './view';
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
import { render, Container, unmountComponentAtNode } from 'react-dom';
import $ from 'jquery';

const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let stars: any;
let meta: RepoMeta;

const getData = async () => {
  stars = await getStars(repoName);
  meta = (await metaStore.get(repoName)) as RepoMeta;
};

const renderTo = (container: Container) => {
  render(<View stars={stars} meta={meta} />, container);
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
  // get the position of the star button
  const offset = $starButton.offset();
  if (!offset) {
    return;
  }
  const { top, left } = offset;
  const width = $starButton.outerWidth();
  const height = $starButton.outerHeight();
  if (!height || !width) {
    return;
  }

  $starButton[0].addEventListener('mouseenter', () => {
    const popoverContainerSelector = 'div.Popover';
    const popoverContentSelector = 'div.Popover-message';
    const $popoverContent = $(popoverContentSelector);
    const contentWidth = $popoverContent.outerWidth();
    if (!contentWidth) {
      return;
    }
    const $popoverContainer = $(popoverContainerSelector);
    $popoverContainer.css('display', 'block');
    $popoverContainer.css('top', `${top + height + 10}px`);
    $popoverContent.removeClass('Popover-message--bottom-left');
    $popoverContent.removeClass('Popover-message--large');
    $popoverContent.css('width', '270px');
    $popoverContainer.css('left', `${left - (contentWidth - width) / 2}px`);
    $popoverContent.addClass('Popover-message--top-middle');
    renderTo($popoverContent[0]);
  });
  $starButton[0].addEventListener('mouseleave', () => {
    const popoverContainerSelector = 'div.Popover';
    const popoverContentSelector = 'div.Popover-message';
    const $popoverContent = $(popoverContentSelector);
    const $popoverContainer = $(popoverContainerSelector);
    $popoverContent.addClass('Popover-message--large');
    $popoverContainer.css('display', 'none');
    if ($popoverContent.children().length > 0) {
      unmountComponentAtNode($popoverContent[0]);
    }
  });
};

const restore = async () => {};

features.add(featureId, {
  asLongAs: [isPublicRepoWithMeta, hasRepoContainerHeader],
  awaitDomReady: false,
  init,
  restore,
});
