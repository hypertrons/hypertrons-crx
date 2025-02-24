import React from 'react';
import $ from 'jquery';
import features from '../../../../feature-manager';
import isPerceptor from '../../../../helpers/is-perceptor';
import { getRepoName, isPublicRepoWithMeta } from '../../../../helpers/get-gitee-repo-info';
import { getActivityDetails } from '../../../../api/repo';
import View from './view';
import DataNotFound from '../repo-networks/DataNotFound';
import { RepoActivityDetails } from './data';
import { createRoot } from 'react-dom/client';
import { getPlatform } from '../../../../helpers/get-platform';
import isGitee from '../../../../helpers/is-gitee';
const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let repoActivityDetails: RepoActivityDetails;
let platform: string;
let width = '80%';
const getData = async () => {
  repoActivityDetails = await getActivityDetails(platform, repoName);
};

const renderTo = (container: any) => {
  const root = createRoot(container);
  if (!repoActivityDetails) {
    root.render(<DataNotFound />);
    return;
  }
  root.render(<View currentRepo={repoName} width={width} repoActivityDetails={repoActivityDetails} />);
};

const init = async (): Promise<void> => {
  platform = getPlatform();
  repoName = getRepoName();
  await getData();
  const container = document.createElement('div');
  container.id = featureId;
  // append before render so that the container has computed width
  $('#hypercrx-perceptor-slot-repo-activity-racing-bar').append(container);
  renderTo(container);
};

const restore = async () => {
  // Clicking another repo link in one repo will trigger a turbo:visit,
  // so in a restoration visit we should be careful of the current repo.
  if (repoName !== getRepoName()) {
    repoName = getRepoName();
  }
  // rerender the chart or it will be empty
  renderTo($(`#${featureId}`)[0]);
};

features.add(featureId, {
  asLongAs: [isGitee, isPerceptor, isPublicRepoWithMeta],
  awaitDomReady: false,
  init,
  restore,
});
