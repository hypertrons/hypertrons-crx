import React from 'react';
import $ from 'jquery';
import elementReady from 'element-ready';
import { render, Container } from 'react-dom';
import { isPerceptor } from '../../../../utils/utils';
import features from '../../../../feature-manager';
import logger from '../../../../utils/logger';
import View from './view';

const featureId = features.getFeatureID(import.meta.url);

const renderTo = (container: Container) => {
  render(<View />, container);
};

const init = async (): Promise<void> => {
  // remove the original container
  const parentContainer = await elementReady('#repo-content-turbo-frame');
  $('h1.sr-only', parentContainer).text('Perceptor');

  const perceptorLayoutContainer = $(
    'div.clearfix.container-xl:first',
    parentContainer
  );
  perceptorLayoutContainer.children('div').remove();

  // create the new one : percepter container
  const percepterContainer = document.createElement('div');
  percepterContainer.setAttribute('id', 'perceptor-layout');

  renderTo(percepterContainer);
  perceptorLayoutContainer.append(percepterContainer);
};

features.add(featureId, {
  asLongAs: [isPerceptor],
  awaitDomReady: false,
  init,
});
