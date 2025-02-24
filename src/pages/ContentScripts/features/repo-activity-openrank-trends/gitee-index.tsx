import React from 'react';
import $ from 'jquery';
import { createRoot } from 'react-dom/client';
import features from '../../../../feature-manager';
import { getRepoName, isPublicRepoWithMeta, isRepoRoot } from '../../../../helpers/get-gitee-repo-info';
import { getActivity, getOpenrank } from '../../../../api/repo';
import { RepoMeta, metaStore } from '../../../../api/common';
import View from './view';
import { getPlatform } from '../../../../helpers/get-platform';
import isGitee from '../../../../helpers/is-gitee';
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

const init = async (): Promise<void> => {
  platform = getPlatform();
  repoName = getRepoName();
  await getData();

  // create container
  const newBorderGridRow = document.createElement('div');
  newBorderGridRow.id = featureId;
  newBorderGridRow.className = 'side-item trend';
  newBorderGridRow.style.marginBottom = '0';
  newBorderGridRow.style.fontWeight = '600';
  newBorderGridRow.style.fontSize = '16px';
  renderTo(newBorderGridRow);
  const borderGridRows = $('div.side-item.contrib');
  borderGridRows.after(newBorderGridRow);
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
  asLongAs: [isGitee, isPublicRepoWithMeta, isRepoRoot],
  awaitDomReady: true,
  init,
  restore,
});
