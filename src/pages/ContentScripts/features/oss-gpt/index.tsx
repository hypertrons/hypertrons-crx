import React from 'react';
import $ from 'jquery';
import features from '../../../../feature-manager';
import getGithubTheme from '../../../../helpers/get-github-theme';
import { getRepoName, isPublicRepo } from '../../../../helpers/get-repo-info';
import View from './view';
import { createRoot, Root } from 'react-dom/client';
const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let root: Root | null = null;
const renderTo = (container: any) => {
  root = createRoot(container);
  root.render(<View githubTheme={getGithubTheme() as 'light' | 'dark'} />);
};

const init = async (): Promise<void> => {
  const container = document.createElement('div');
  container.id = featureId;
  container.dataset.repo = repoName; // mark current repo by data-repo
  renderTo(container);
  document.body.appendChild(container);
  // TODO need a mechanism to remove extra listeners like this one
  document.addEventListener('turbo:load', async () => {
    if (await isPublicRepo()) {
      if (repoName !== getRepoName() && root == null) {
        repoName = getRepoName();
        renderTo($(`#${featureId}`)[0]);
      }
    } else {
      $(`#${featureId}`).remove();
    }
  });
};

features.add(featureId, {
  include: [isPublicRepo],
  awaitDomReady: true,
  init,
});
