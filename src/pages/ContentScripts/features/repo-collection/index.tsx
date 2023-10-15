import features from '../../../../feature-manager';
import { isPublicRepo } from '../../../../helpers/get-repo-info';
import View from './View';

import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import elementReady from 'element-ready';

const featureId = features.getFeatureID(import.meta.url);

const init = async (): Promise<void> => {
  const container = document.createElement('li');
  container.id = featureId;
  render(<View />, container);
  await elementReady('#repository-details-container');
  $('#repository-details-container>ul').prepend(container);
};

features.add(featureId, {
  include: [isPublicRepo],
  awaitDomReady: true,
  init,
});
