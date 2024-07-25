import React from 'react';
import { render, Container } from 'react-dom';
import $ from 'jquery';

import features from '../../../../feature-manager';
import isPerceptor from '../../../../helpers/is-perceptor';
import { getRepoName, isPublicRepoWithMeta } from '../../../../helpers/get-repo-info';
import { getOpenRank } from '../../../../api/community';
import { RepoMeta, metaStore } from '../../../../api/common';
import View from './view';
import './index.scss';
import DataNotFound from '../repo-networks/DataNotFound';

const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let openRank: any;
let meta: RepoMeta;

const getData = async () => {
  meta = (await metaStore.get(repoName)) as RepoMeta;
  openRank = await getOpenRank(repoName, '2023-09');
};

const renderTo = (container: Container) => {
  if (!openRank) {
    render(<DataNotFound />, container);
    return;
  }
  render(<View repoName={repoName} openrank={openRank} meta={meta} />, container);
};

const init = async (): Promise<void> => {
  repoName = getRepoName();
  await getData();
  // create container
  const container = document.createElement('div');
  container.id = featureId;

  $('#hypercrx-perceptor-slot-community-openrank-network').append(container);
  renderTo(container);
};

const restore = async () => {
  // Clicking another repo link in one repo will trigger a turbo:visit,
  // so in a restoration visit we should be careful of the current repo.
  if (repoName !== getRepoName()) {
    repoName = getRepoName();
    await getData();
  }
  // rerender the chart or it will be empty
  renderTo($(`#${featureId}`)[0]);
};

features.add(featureId, {
  asLongAs: [isPerceptor, isPublicRepoWithMeta],
  awaitDomReady: true,
  init,
  restore,
});
