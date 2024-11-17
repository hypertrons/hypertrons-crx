import React from 'react';
import $ from 'jquery';

import features from '../../../../../feature-manager';
import { getDeveloperName, isDeveloperWithMeta } from '../../../../../helpers/get-developer-info';
import { getActivity, getOpenrank } from '../../../../../api/developer';
import { UserMeta, metaStore } from '../../../../../api/common';
import View from './view';
import { createRoot } from 'react-dom/client';
import isGithub from '../../../../../helpers/is-github';
import { getPlatform } from '../../../../../helpers/platform-detection';
const featureId = features.getFeatureID(import.meta.url);
let developerName: string;
let activity: any;
let openrank: any;
let meta: UserMeta;

const getData = async () => {
  const platform = getPlatform();
  activity = await getActivity(platform, developerName);
  openrank = await getOpenrank(platform, developerName);
  meta = (await metaStore.get(platform, developerName)) as UserMeta;
};

const renderTo = (container: any) => {
  createRoot(container).render(<View activity={activity} openrank={openrank} meta={meta} />);
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
  asLongAs: [isGithub, () => isDeveloperWithMeta(getPlatform())],
  awaitDomReady: false,
  init,
  restore,
});
