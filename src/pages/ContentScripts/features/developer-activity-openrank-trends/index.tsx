import React from 'react';
import { render, Container } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';

import features from '../../../../feature-manager';
import {
  getDeveloperName,
  isDeveloperWithMeta,
} from '../../../../helpers/get-developer-info';
import { getActivity, getOpenrank } from '../../../../api/developer';
import View from './view';

const featureId = features.getFeatureID(import.meta.url);
let developerName: string;
let activity: any;
let openrank: any;

const getData = async () => {
  activity = await getActivity(developerName);
  openrank = await getOpenrank(developerName);
};

const renderTo = (container: Container) => {
  render(<View activity={activity} openrank={openrank} />, container);
};

const init = async (): Promise<void> => {
  developerName = getDeveloperName();
  await getData();

  // create container
  const newContainer = document.createElement('div');
  newContainer.id = featureId;

  renderTo(newContainer);

  const profileArea = $('.js-profile-editable-area').parent();
  profileArea.after(newContainer);
};

const restore = async () => {
  // Clicking another developer link in one repo will trigger a turbo:visit,
  // so in a restoration visit we should be careful of the current developer.
  if (developerName !== getDeveloperName()) {
    developerName = getDeveloperName();
    await getData();
  }
  renderTo($(`#${featureId}`)[0]);
};
features.add(featureId, {
  asLongAs: [isDeveloperWithMeta],
  awaitDomReady: false,
  init,
  restore,
});
