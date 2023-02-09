import React from 'react';
import { render, Container } from 'react-dom';
import elementReady from 'element-ready';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';

import features from '../../../../feature-manager';
import { getRepoName } from '../../../../helpers/get-repo-info';
import { getActivity, getOpenrank } from '../../../../api/repo';
import View from './view';

const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let activity: any;
let openrank: any;

const getData = async () => {
  try {
    activity = await getActivity(repoName);
    openrank = await getOpenrank(repoName);
  } catch (e) {
    console.error(e);
  }
};

const renderTo = (container: Container) => {
  render(
    <View repoName={repoName} activity={activity} openrank={openrank} />,
    container
  );
};

const init = async (): Promise<void> => {
  repoName = getRepoName();
  await getData();

  // create container
  const newBorderGridRow = document.createElement('div');
  newBorderGridRow.id = featureId;
  newBorderGridRow.className = 'BorderGrid-row';
  const newBorderGridCell = document.createElement('div');
  newBorderGridCell.className = 'BorderGrid-cell';
  newBorderGridRow.appendChild(newBorderGridCell);

  /**
   * `awaitDomReady` is set to `false` below, which means the `init()` of this feature
   * will run as early as possible without waiting for the whole DOM ready. So the time
   * saved can be used to fetch data and create elements and etc. However, certain DOM
   * nodes should still be waited because before injecting features(elements) into pages
   * those related DOM nodes must exist. Otherwise there would be no place to inject the
   * feature then errors would occur.
   */
  await elementReady('div.Layout-sidebar');
  renderTo(newBorderGridCell);

  const borderGridRows = $('div.Layout-sidebar').children('.BorderGrid');
  borderGridRows.append(newBorderGridRow);
};

const restore = async () => {
  // Clicking another repo link in one repo will trigger a turbo:visit,
  // so in a restoration visit we should be careful of the current repo.
  if (repoName !== getRepoName()) {
    repoName = getRepoName();
    await getData();
  }
  // rerender the chart or it will be empty
  renderTo($(`#${featureId}`).children('.BorderGrid-cell')[0]);
};

features.add(featureId, {
  include: [pageDetect.isRepoHome],
  awaitDomReady: false,
  init,
  restore,
});
