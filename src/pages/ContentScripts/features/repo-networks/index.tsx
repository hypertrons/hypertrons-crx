import React from 'react';
import { render, Container } from 'react-dom';
import $ from 'jquery';

import features from '../../../../feature-manager';
import isPerceptor from '../../../../helpers/is-perceptor';
import { getRepoName, isPublicRepoWithMeta } from '../../../../helpers/get-repo-info';
import { getRepoNetwork, getDeveloperNetwork } from '../../../../api/repo';
import View from './view';
import DataNotFound from './DataNotFound';

const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let repoNetworks: any;
let developerNetworks: any;

const getData = async () => {
  repoNetworks = await getRepoNetwork(repoName);
  developerNetworks = await getDeveloperNetwork(repoName);
};

const renderTo = (container: Container) => {
  if (!repoNetworks || !developerNetworks) {
    render(<DataNotFound />, container);
    return;
  }
  render(<View currentRepo={repoName} repoNetwork={repoNetworks} developerNetwork={developerNetworks} />, container);
};

const init = async (): Promise<void> => {
  repoName = getRepoName();
  await getData();
  const container = document.createElement('div');
  container.id = featureId;
  renderTo(container);
  $('#hypercrx-perceptor-slot-repo-networks').append(container);
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
  awaitDomReady: false,
  init,
  restore,
});
