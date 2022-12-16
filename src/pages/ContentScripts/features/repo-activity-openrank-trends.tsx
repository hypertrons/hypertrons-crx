import React from 'react';
import { render } from 'react-dom';
import elementReady from 'element-ready';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';

import features from '../../../feature-manager';
import exists from '../../../helpers/exsists';
import { getRepoName } from '../../../helpers/get-repo-info';
import RepoActORTrendView from '../../../views/RepoActORTrendView/RepoActORTrendView';

const featureId = features.getFeatureID(import.meta.url);

async function init(): Promise<void> {
  const newBorderGridRow = document.createElement('div');
  newBorderGridRow.id = featureId;
  newBorderGridRow.className = 'BorderGrid-row';
  const newBorderGridCell = document.createElement('div');
  newBorderGridCell.className = 'BorderGrid-cell';
  newBorderGridRow.appendChild(newBorderGridCell);

  await elementReady('div.Layout-sidebar');
  render(<RepoActORTrendView currentRepo={getRepoName()} />, newBorderGridCell);

  const borderGridRows = $('div.Layout-sidebar').children('.BorderGrid');
  borderGridRows.append(newBorderGridRow);
}

const restore = () => {
  if (exists(`#${featureId}`)) {
    render(
      <RepoActORTrendView currentRepo={getRepoName()} />,
      $(`#${featureId}`).children('.BorderGrid-cell')[0]
    );
  }
};

features.add(featureId, {
  include: [pageDetect.isRepoHome],
  awaitDomReady: false,
  init,
  restore,
});
