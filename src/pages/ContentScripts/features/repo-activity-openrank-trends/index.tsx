import React from 'react';
import $ from 'jquery';
import { createRoot } from 'react-dom/client';
import features from '../../../../feature-manager';
import elementReady from 'element-ready';
import {
  getRepoName,
  getRepoSidebarBorderGrid,
  getRepoSidebarSection,
  isPublicRepoWithMeta,
  isRepoRoot,
  observeRepoSidebarReplacement,
  repoSidebarMarkerSelector,
} from '../../../../helpers/get-github-repo-info';
import { getActivity, getOpenrank } from '../../../../api/repo';
import { RepoMeta, metaStore } from '../../../../api/common';
import View from './view';
import isGithub from '../../../../helpers/is-github';
import { getPlatform } from '../../../../helpers/get-platform';
const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let activity: any;
let openrank: any;
let meta: RepoMeta;
let platform: string;
const getData = async () => {
  activity = await getActivity(platform, repoName);
  openrank = await getOpenrank(platform, repoName);
  meta = (await metaStore.get(platform, repoName)) as RepoMeta;
};

const renderTo = (container: any) => {
  createRoot(container).render(<View repoName={repoName} activity={activity} openrank={openrank} meta={meta} />);
};

const createTrendRow = () => {
  const existingRow = document.getElementById(featureId);
  existingRow?.remove();

  const newBorderGridRow = document.createElement('div');
  newBorderGridRow.id = featureId;
  newBorderGridRow.className = 'BorderGrid-row';
  const newBorderGridCell = document.createElement('div');
  newBorderGridCell.className = 'BorderGrid-cell hypercrx-repo-activity-openrank-trends-content';
  newBorderGridRow.appendChild(newBorderGridCell);

  return { row: newBorderGridRow, cell: newBorderGridCell };
};

const mountTrendRow = (row: HTMLElement) => {
  const $sidebarContainer = getRepoSidebarBorderGrid();
  if ($sidebarContainer.length === 0) {
    return false;
  }

  if (!$sidebarContainer.is('.BorderGrid')) {
    row.className = getRepoSidebarSection().attr('class') || 'hide-sm hide-md';
    $(row).children().first().removeClass('BorderGrid-cell');
  }

  $sidebarContainer.append(row);
  return true;
};

const init = async (): Promise<void> => {
  platform = getPlatform();
  repoName = getRepoName();
  await getData();
  await elementReady(repoSidebarMarkerSelector);

  const { row, cell } = createTrendRow();
  renderTo(cell);
  if (!mountTrendRow(row)) {
    return;
  }
  observeRepoSidebarReplacement(featureId, repoName, () => {
    const { row, cell } = createTrendRow();
    renderTo(cell);
    if (!mountTrendRow(row)) {
      return;
    }
  });
};

const restore = async () => {
  // Clicking another repo link in one repo will trigger a turbo:visit,
  // so in a restoration visit we should be careful of the current repo.
  if (repoName !== getRepoName()) {
    repoName = getRepoName();
    await getData();
  }
  // rerender the chart or it will be empty
  await elementReady(repoSidebarMarkerSelector);
  let container = $(`#${featureId}`).children()[0];

  if (!container) {
    const { row, cell } = createTrendRow();
    if (!mountTrendRow(row)) {
      return;
    }
    container = cell;
  }

  renderTo(container);
};

features.add(featureId, {
  asLongAs: [isGithub, isPublicRepoWithMeta, isRepoRoot],
  awaitDomReady: true,
  init,
  restore,
});
