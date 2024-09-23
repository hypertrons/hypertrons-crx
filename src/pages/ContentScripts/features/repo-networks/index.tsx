import React from 'react';
import $ from 'jquery';

import features from '../../../../feature-manager';
import isPerceptor from '../../../../helpers/is-perceptor';
import View from './view';
import elementReady from 'element-ready';
import { createRoot } from 'react-dom/client';
const featureId = features.getFeatureID(import.meta.url);

let repoID: any;

const renderTo = (container: any) => {
  createRoot(container).render(<View repoID={repoID} />);
};

const init = async (): Promise<void> => {
  repoID = $('meta[name="octolytics-dimension-repository_network_root_id"]').attr('content');
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
  asLongAs: [isPerceptor],
  awaitDomReady: false,
  init,
  restore,
});
