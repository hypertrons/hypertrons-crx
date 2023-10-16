import features from '../../../../feature-manager';
import { isPublicRepo, getRepoName } from '../../../../helpers/get-repo-info';
import View from './view';

import React from 'react';
import { render, Container } from 'react-dom';
import $ from 'jquery';
import elementReady from 'element-ready';

const featureId = features.getFeatureID(import.meta.url);
let repoName: string;

const renderTo = (container: Container) => {
  render(<View repoName={repoName} />, container);
};

const init = async (): Promise<void> => {
  repoName = getRepoName();

  const container = document.createElement('li');
  container.id = featureId;
  renderTo(container);
  await elementReady('#repository-details-container');
  $('#repository-details-container>ul').prepend(container);
};

const restore = async () => {
  if (repoName !== getRepoName()) {
    repoName = getRepoName();
  }
  renderTo($(`#${featureId}`)[0]);
};

features.add(featureId, {
  include: [isPublicRepo],
  awaitDomReady: true,
  init,
  restore,
});
