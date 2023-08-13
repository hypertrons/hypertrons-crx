import React from 'react';
import { render, Container } from 'react-dom';
import elementReady from 'element-ready';
import $ from 'jquery';

import features from '../../../../feature-manager';
import getGithubTheme from '../../../../helpers/get-github-theme';
import {
  getRepoName,
  isPublicRepoWithMeta,
} from '../../../../helpers/get-repo-info';
import { getForks } from '../../../../api/repo';
import { RepoMeta, metaStore } from '../../../../api/common';
import View from './view';

const githubTheme = getGithubTheme();
const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let forks: any;
let meta: RepoMeta;

const getData = async () => {
  forks = await getForks(repoName);
  meta = (await metaStore.get(repoName)) as RepoMeta;
};

const renderTo = (container: Container) => {
  render(<View forks={forks} meta={meta} />, container);
};

const init = async (): Promise<void> => {
  repoName = getRepoName();
  await getData();

  await elementReady('a[data-ga-click*="show fork modal"]');
  $('a[data-ga-click*="show fork modal"]').attr({
    'data-tip': '',
    'data-for': 'fork-tooltip',
    'data-class': `floating-window ${githubTheme}`,
    'data-place': 'left',
    'data-effect': 'solid',
    'data-delay-hide': 500,
    'data-delay-show': 1000,
    style: { color: githubTheme === 'light' ? '#24292f' : '#c9d1d9' },
    'data-text-color': githubTheme === 'light' ? '#24292F' : '#C9D1D9',
    'data-background-color': githubTheme === 'light' ? 'white' : '#161B22',
  });
  const container = document.createElement('div');
  container.id = featureId;
  renderTo(container);
  (await elementReady('#repository-container-header'))?.append(container);
};

const restore = async () => {
  // Clicking another repo link in one repo will trigger a turbo:visit,
  // so in a restoration visit we should be careful of the current repo.
  if (repoName !== getRepoName()) {
    repoName = getRepoName();
    await getData();
  }
  // Ideally, we should do nothing if the container already exists. But after a tubor
  // restoration visit, tooltip cannot be triggered though it exists in DOM tree. One
  // way to solve this is to rerender the view to the container. At least this way works.
  renderTo($(`#${featureId}`)[0]);
};

features.add(featureId, {
  asLongAs: [isPublicRepoWithMeta],
  awaitDomReady: false,
  init,
  restore,
});
