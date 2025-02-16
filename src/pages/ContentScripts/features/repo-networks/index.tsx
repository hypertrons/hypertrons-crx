import React from 'react';
import $ from 'jquery';

import features from '../../../../feature-manager';
import isPerceptor from '../../../../helpers/is-perceptor';
import View from './view';
import elementReady from 'element-ready';
import { createRoot } from 'react-dom/client';
import { getRepoName } from '../../../../helpers/get-github-repo-info';
import isGithub from '../../../../helpers/is-github';

const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
const renderTo = (container: any) => {
  createRoot(container).render(<View repoName={repoName} />);
};

const init = async (): Promise<void> => {
  repoName = getRepoName();
  const networksContainer = '#hypercrx-perceptor-slot-repo-networks';
  await elementReady(networksContainer, { stopOnDomReady: false });
  const container = document.createElement('div');
  container.id = featureId;
  renderTo(container);
  $(networksContainer).append(container);
};

const restore = async () => {
  // rerender the chart or it will be empty
  renderTo($(`#${featureId}`)[0]);
};

features.add(featureId, {
  asLongAs: [isGithub, isPerceptor],
  awaitDomReady: false,
  init,
  restore,
});
