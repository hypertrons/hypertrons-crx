import React from 'react';
import { render, Container } from 'react-dom';
import elementReady from 'element-ready';
import $ from 'jquery';

import features from '../../../../feature-manager';
import { isPublicRepo, getGithubTheme } from '../../../../utils/utils';
import { getRepoName } from '../../../../helpers/get-repo-info';
import exists from '../../../../helpers/exists';
import { getForks } from '../../../../api/repo';
import View from './view';

const githubTheme = getGithubTheme();
const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let forks: any;

const getData = async () => {
  try {
    forks = await getForks(repoName);
  } catch (e) {
    console.error(e);
  }
};

const attach = async () => {
  await elementReady('a[data-ga-click*="show fork modal"]');

  // Ideally, we should do nothing if the container already exists. But
  // when I try to navigate back from profile page, I find tooltip won't
  // show though the related element exists. I think there might be something
  // else in javascript context, which is broken after navigation between
  // pages. So instead of doing nothing, I remove the container and reload
  // it again. At least this way works.
  if (exists(`#${featureId}`)) {
    await elementReady(`#${featureId}`); // should be waited or it cannot be removed
    $(`#${featureId}`).remove();
  }

  $('a[data-ga-click*="show fork modal"]').attr({
    'data-tip': '',
    'data-for': 'fork-tooltip',
    'data-class': `floating-window ${githubTheme}`,
    'data-place': 'bottom',
    'data-effect': 'solid',
    'data-delay-hide': 500,
    'data-delay-show': 500,
    style: { color: githubTheme === 'light' ? '#24292f' : '#c9d1d9' },
    'data-text-color': githubTheme === 'light' ? '#24292F' : '#C9D1D9',
    'data-background-color': githubTheme === 'light' ? 'white' : '#161B22',
  });
  const tooltipContainer = document.createElement('div');
  tooltipContainer.id = featureId;

  render(<View forks={forks} />, tooltipContainer);

  await elementReady('#repository-container-header');
  $('#repository-container-header').append(tooltipContainer);
};

const init = async (): Promise<void> => {
  repoName = getRepoName();
  await getData();
  await attach();
};

const restore = async () => {
  // Clicking another repo link in one repo will trigger a turbo:visit,
  // so in a restoration visit we should be careful of the current repo.
  if (repoName !== getRepoName()) {
    repoName = getRepoName();
    await getData();
  }
  await attach();
};

features.add(featureId, {
  asLongAs: [isPublicRepo],
  awaitDomReady: false,
  init,
  restore,
});
