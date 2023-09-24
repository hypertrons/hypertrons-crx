import React from 'react';
import { render, Container } from 'react-dom';
import $ from 'jquery';
import features from '../../../../feature-manager';
import * as pageDetect from 'github-url-detection';
import { getDeveloperName } from '../../../../helpers/get-developer-info';
import isPublicRepo from '../../../../helpers/is-public-repo';
import View from './view';
import getGithubTheme from '../../../../helpers/get-github-theme';
import elementReady from 'element-ready';

const featureId = features.getFeatureID(import.meta.url);

const renderTo = (container: Container) => {
  render(<View />, container);
};

const init = async (): Promise<void> => {
  const container = document.createElement('div');
  container.id = featureId;
  renderTo(container);
  await elementReady('#repository-container-header');
  $('#repository-details-container').before(container);
};

features.add(featureId, {
  include: [isPublicRepo],
  awaitDomReady: true,
  init,
});
