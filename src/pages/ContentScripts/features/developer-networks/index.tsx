import React from 'react';
import $ from 'jquery';
import { createRoot } from 'react-dom/client';
import elementReady from 'element-ready';

import features from '../../../../feature-manager';
import { isUserProfile } from '../../../../helpers/get-developer-info';
import View from './view';
import isGithub from '../../../../helpers/is-github';

const featureId = features.getFeatureID(import.meta.url);

let userID: any;

const renderTo = (container: any) => {
  createRoot(container).render(<View userID={userID} />);
};

const init = async (): Promise<void> => {
  userID = $('meta[name="octolytics-dimension-user_id"]').attr('content');
  const container = document.createElement('div');
  container.id = featureId;
  renderTo(container);
  await elementReady('.js-profile-editable-area');
  $('.js-profile-editable-area').parent().append(container);
};

const restore = async () => {
  // elements of ReactModal are appended to the body each time `renderTo` is called,
  // if we don't clean up the old elements, there will be many useless tags.
  $('div.ReactModalPortal').remove();
  // rerender the chart or it will be empty
  renderTo($(`#${featureId}`)[0]);
};

features.add(featureId, {
  asLongAs: [isGithub, isUserProfile],
  awaitDomReady: false,
  init,
  restore,
});
