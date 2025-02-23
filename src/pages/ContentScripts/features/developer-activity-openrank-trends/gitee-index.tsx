import React from 'react';
import $ from 'jquery';
import features from '../../../../feature-manager';
import { getDeveloperName, isDeveloperWithMeta } from '../../../../helpers/get-gitee-developer-info';
import { getActivity, getOpenrank } from '../../../../api/developer';
import { UserMeta, metaStore } from '../../../../api/common';
import View from './view';
import { createRoot } from 'react-dom/client';
import { getPlatform } from '../../../../helpers/get-platform';
import isGitee from '../../../../helpers/is-gitee';
const featureId = features.getFeatureID(import.meta.url);
let developerName: string;
let activity: any;
let openrank: any;
let meta: UserMeta;
let platform: string;
const getData = async () => {
  activity = await getActivity(platform, developerName);
  openrank = await getOpenrank(platform, developerName);
  meta = (await metaStore.get(platform, developerName)) as UserMeta;
};

const renderTo = (container: any) => {
  createRoot(container).render(<View activity={activity} openrank={openrank} meta={meta} />);
};

const init = async (): Promise<void> => {
  platform = getPlatform();
  developerName = getDeveloperName();
  await getData();
  // create container
  const newContainer = document.createElement('div');
  newContainer.id = featureId;

  renderTo(newContainer);

  const profileArea = $('.users__personal-container');
  const constusersReport = $('.users__report.mt-3');
  if (constusersReport.length > 0) {
    // 使用原生 JavaScript 设置样式
    constusersReport[0].style.setProperty('margin-top', '0', 'important');
  }
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
  asLongAs: [isGitee, isDeveloperWithMeta],
  awaitDomReady: false,
  init,
  restore,
});
