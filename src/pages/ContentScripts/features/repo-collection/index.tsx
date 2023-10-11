import React from 'react';
import { render, Container } from 'react-dom';
import $ from 'jquery';
import elementReady from 'element-ready';
import * as pageDetect from 'github-url-detection';

import features from '../../../../feature-manager';
import { getDeveloperName } from '../../../../helpers/get-developer-info';
import isPublicRepo from '../../../../helpers/is-public-repo';
import View from './view';
import getGithubTheme from '../../../../helpers/get-github-theme';
import MyDropdown from './MyDropdown';

const featureId = features.getFeatureID(import.meta.url);

const init = async (): Promise<void> => {
  const myDropdownContainer = document.createElement('div');
  myDropdownContainer.id = featureId;
  render(<MyDropdown />, myDropdownContainer);
  await elementReady('#repository-container-header');
  $('#repository-details-container').before(myDropdownContainer);

  const viewContainer = document.createElement('div');
  viewContainer.id = featureId;
  render(<View />, viewContainer);
  $('body').append(viewContainer);
};

features.add(featureId, {
  include: [isPublicRepo],
  awaitDomReady: true,
  init,
});
