import React, { useState } from 'react';
import { render, Container } from 'react-dom';
import $ from 'jquery';
import View from './view';

import features from '../../../../feature-manager';
import { isPublicRepo } from '../../../../helpers/get-repo-info';

const featureId = features.getFeatureID(import.meta.url);

const renderTo = (container: Container) => {
  render(<View />, container);
};

const init = async (): Promise<void> => {
  const container = document.createElement('div');
  container.id = featureId;
  renderTo(container);
  $('body').append(container);
};

features.add(featureId, {
  asLongAs: [isPublicRepo],
  awaitDomReady: false,
  init,
});
