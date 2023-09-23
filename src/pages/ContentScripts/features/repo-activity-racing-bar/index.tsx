import React from 'react';
import { render, Container } from 'react-dom';
import $ from 'jquery';

import features from '../../../../feature-manager';
import isPerceptor from '../../../../helpers/is-perceptor';
import {
  getRepoName,
  isPublicRepoWithMeta,
} from '../../../../helpers/get-repo-info';
import { getActivityDetails } from '../../../../api/repo';
import View from './view';
import DataNotFound from '../repo-networks/DataNotFound';
import { RepoActivityDetails } from './data';

const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let repoActivityDetails: RepoActivityDetails;

const getData = async () => {
  repoActivityDetails = await getActivityDetails(repoName);
};

const renderTo = (container: Container) => {
  if (!repoActivityDetails) {
    render(<DataNotFound />, container);
    return;
  }
  render(
    <View currentRepo={repoName} repoActivityDetails={repoActivityDetails} />,
    container
  );
};

const init = async (): Promise<void> => {
  repoName = getRepoName();
  await getData();
  const container = document.createElement('div');
  container.id = featureId;
  renderTo(container);
  const parentElement = document.getElementById('hypercrx-perceptor-layout');
  if (parentElement) {
    parentElement.append(container);
  }
};

const restore = async () => {
  // Clicking another repo link in one repo will trigger a turbo:visit,
  // so in a restoration visit we should be careful of the current repo.
  if (repoName !== getRepoName()) {
    repoName = getRepoName();
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
