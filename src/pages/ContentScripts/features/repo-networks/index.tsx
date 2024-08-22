import React from 'react';
import { render, Container } from 'react-dom';
import $ from 'jquery';

import features from '../../../../feature-manager';
import isPerceptor from '../../../../helpers/is-perceptor';
import { isPublicRepoWithMeta } from '../../../../helpers/get-repo-info';
import View from './view';
import elementReady from 'element-ready';

const featureId = features.getFeatureID(import.meta.url);

let repoID: any;

const renderTo = (container: Container) => {
  render(<View repoID={repoID} />, container);
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
