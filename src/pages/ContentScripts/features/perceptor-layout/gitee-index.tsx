import React from 'react';
import $ from 'jquery';
import { createRoot } from 'react-dom/client';
import features from '../../../../feature-manager';
import isPerceptor from '../../../../helpers/is-perceptor';
import View from './view';
import isGitee from '../../../../helpers/is-gitee';

const featureId = features.getFeatureID(import.meta.url);

const renderTo = (container: any) => {
  createRoot(container).render(<View />);
};

const init = async (): Promise<void> => {
  const uiContainer = $('.site-content > .ui.container');
  uiContainer.empty();

  // create the new one: the percepter container
  const percepterContainer = document.createElement('div');
  percepterContainer.id = featureId;

  uiContainer.append(percepterContainer);

  renderTo(percepterContainer);
};

features.add(featureId, {
  asLongAs: [isGitee, isPerceptor],
  awaitDomReady: false,
  init,
});
