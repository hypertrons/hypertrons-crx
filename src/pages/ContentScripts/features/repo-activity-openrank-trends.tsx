import React from 'react';
import { render } from 'react-dom';
import elementReady from 'element-ready';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';

import features from '../../../feature-manager';
import RepoActORTrendView from '../../../views/RepoActORTrendView/RepoActORTrendView';

const featureId = features.getFeatureID(import.meta.url);

async function init(): Promise<void> {
  const repoName = pageDetect.utils.getRepositoryInfo(
    window.location
  )!.nameWithOwner;

  const newBorderGridRow = document.createElement('div');
  newBorderGridRow.id = featureId;
  newBorderGridRow.className = 'BorderGrid-row';
  const newBorderGridCell = document.createElement('div');
  newBorderGridCell.className = 'BorderGrid-cell';
  newBorderGridRow.appendChild(newBorderGridCell);

  await elementReady('div.Layout-sidebar');
  render(<RepoActORTrendView currentRepo={repoName} />, newBorderGridCell);

  const borderGridRows = $('div.Layout-sidebar').children('.BorderGrid');
  borderGridRows.append(newBorderGridRow);

  // TODO this listener should be deinited once we have prepared a deinit mechanism
  // deduplicate can avoid rerunning the init() function after browser forward/back,
  // but echarts will be empty though the dom exists in the page if we do nothing.
  // so the code below is to render the view to the mount node again as we do before.
  // it can be improved by extracting the API request code out to avoid redundant request.
  document.addEventListener('turbo:render', () => {
    if ($(`#${featureId}`).length > 0) {
      render(
        <RepoActORTrendView currentRepo={repoName} />,
        $(`#${featureId}`).children('.BorderGrid-cell')[0]
      );
    }
  });
}

void features.add(featureId, {
  include: [pageDetect.isRepoHome],
  awaitDomReady: false,
  deduplicate: `#${featureId}`,
  init,
});
