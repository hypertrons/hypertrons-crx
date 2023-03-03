import React from 'react';
import { render, Container } from 'react-dom';
import elementReady from 'element-ready';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';

import features from '../../../../feature-manager';
import { getDeveloperName } from '../../../../helpers/get-developer-info';
import { getActivity, getOpenrank } from '../../../../api/developer';
import View from './view';

const featureId = features.getFeatureID(import.meta.url);
let developerName: string;
let activity: any;
let openrank: any;

const getData = async () => {
  try {
    activity = await getActivity(developerName);
    openrank = await getOpenrank(developerName);
  } catch (e) {
    console.error(e);
  }
};

const renderTo = (container: Container) => {
  render(
    <View
      developerName={developerName}
      activity={activity}
      openrank={openrank}
    />,
    container
  );
};

const init = async (): Promise<void> => {
  developerName = getDeveloperName();
  await getData();

  // create container
  const newContainer = document.createElement('div');
  newContainer.id = featureId;
  newContainer.style.width = '100%';

  /**
   * `awaitDomReady` is set to `false` below, which means the `init()` of this feature
   * will run as early as possible without waiting for the whole DOM ready. So the time
   * saved can be used to fetch data and create elements and etc. However, certain DOM
   * nodes should still be waited because before injecting features(elements) into pages
   * those related DOM nodes must exist. Otherwise there would be no place to inject the
   * feature then errors would occur.
   */
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
  include: [pageDetect.isUserProfile],
  awaitDomReady: true,
  init,
  restore,
});
