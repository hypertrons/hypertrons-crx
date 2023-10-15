import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import elementReady from 'element-ready';

import features from '../../../../feature-manager';
import { isPublicRepo } from '../../../../helpers/get-repo-info';
import View from './view';
import { CollectionButton } from './CollectionButton';

const featureId = features.getFeatureID(import.meta.url);

const init = async (): Promise<void> => {
  // insert the button
  const buttonContainer = document.createElement('li');
  buttonContainer.id = `${featureId}-button`;
  render(<CollectionButton />, buttonContainer);
  await elementReady('#repository-details-container');
  $('#repository-details-container>ul').prepend(buttonContainer);
  // insert the modal
  const modalContainer = document.createElement('div');
  modalContainer.id = featureId;
  render(<View />, modalContainer);
  $('body').append(modalContainer);
};

features.add(featureId, {
  include: [isPublicRepo],
  awaitDomReady: true,
  init,
});
