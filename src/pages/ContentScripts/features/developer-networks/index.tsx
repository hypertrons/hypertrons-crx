import React from 'react';
import { render, Container } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import elementReady from 'element-ready';

import features from '../../../../feature-manager';
import {
  getDeveloperName,
  isDeveloperWithMeta,
} from '../../../../helpers/get-developer-info';
import { getDeveloperNetwork, getRepoNetwork } from '../../../../api/developer';
import View from './view';

const featureId = features.getFeatureID(import.meta.url);
let developerName: string;
let developerNetworks: any;
let repoNetworks: any;

const getData = async () => {
  developerNetworks = await getDeveloperNetwork(developerName);
  repoNetworks = await getRepoNetwork(developerName);
};

const renderTo = (container: Container) => {
  if (!developerNetworks || !repoNetworks) {
    return;
  }
  render(
    <View
      currentRepo={developerName}
      developerNetwork={developerNetworks}
      repoNetwork={repoNetworks}
    />,
    container
  );
};

const init = async (): Promise<void> => {
  developerName = getDeveloperName();
  await getData();
  const container = document.createElement('div');
  container.id = featureId;
  renderTo(container);
  await elementReady('.js-profile-editable-area');
  $('.js-profile-editable-area').parent().append(container);
};

const restore = async () => {
  // Clicking another repo link in one repo will trigger a turbo:visit,
  // so in a restoration visit we should be careful of the current repo.
  if (developerName !== getDeveloperName()) {
    developerName = getDeveloperName();
    await getData();
  }
  // elements of ReactModal are appended to the body each time `renderTo` is called,
  // if we don't clean up the old elements, there will be many useless tags.
  $('div.ReactModalPortal').remove();
  // rerender the chart or it will be empty
  renderTo($(`#${featureId}`)[0]);
};

features.add(featureId, {
  asLongAs: [isDeveloperWithMeta],
  awaitDomReady: false,
  init,
  restore,
});
