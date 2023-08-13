import React from 'react';
import { render, Container } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';

import features from '../../../../feature-manager';
import {
  getRepoName,
  isPublicRepoWithMeta,
} from '../../../../helpers/get-repo-info';
import { getActivity, getOpenrank } from '../../../../api/repo';
import View from './view';

const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let activity: any;
let openrank: any;

const getData = async () => {
  activity = await getActivity(repoName);
  openrank = await getOpenrank(repoName);
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
  asLongAs: [isPublicRepoWithMeta],
  awaitDomReady: true,
  init,
  restore,
});
