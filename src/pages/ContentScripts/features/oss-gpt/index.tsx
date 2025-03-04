import React from 'react';
import { createRoot } from 'react-dom/client';
import $ from 'jquery';

import features from '../../../../feature-manager';
import getGithubTheme from '../../../../helpers/get-github-theme';
import { getRepoName, isPublicRepo } from '../../../../helpers/get-github-repo-info';
import View from './view';
import isGithub from '../../../../helpers/is-github';

interface DocsMetaItem {
  type: 'repo' | 'org';
  name: string; // GitHub repo name or org name
  key: string; // corresponding docs name
}

const DOCS_META_DATA_URL = 'https://oss.x-lab.info/hypercrx/docsgpt_active_docs.json';
const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let docsMetaData: DocsMetaItem[];

const getData = async () => {
  const response = await fetch(DOCS_META_DATA_URL);
  if (response.ok) {
    docsMetaData = await response.json();
  } else {
    throw new Error('Failed to fetch docs meta data');
  }
};

const getCurrentDocsName = (repoName: string): string | null => {
  const orgName = repoName.split('/')[0];
  let result = null;
  for (const item of docsMetaData) {
    if (item.type === 'repo' && item.name === repoName) {
      result = item.key;
      break;
    } else if (item.type === 'org' && item.name === orgName) {
      result = item.key;
      break;
    }
  }
  return result;
};

const renderTo = (container: any) => {
  createRoot(container).render(
    <View
      theme={getGithubTheme() as 'light' | 'dark'}
      currentRepo={repoName}
      currentDocsName={getCurrentDocsName(repoName)}
    />
  );
};

const init = async (): Promise<void> => {
  repoName = getRepoName();
  await getData();

  const container = document.createElement('div');
  container.id = featureId;
  container.dataset.repo = repoName; // mark current repo by data-repo
  renderTo(container);
  $('body').append(container);

  // TODO need a mechanism to remove extra listeners like this one
  document.addEventListener('turbo:load', async () => {
    if (await isPublicRepo()) {
      if (repoName !== getRepoName()) {
        repoName = getRepoName();
        renderTo($(`#${featureId}`)[0]);
      }
    } else {
      $(`#${featureId}`).remove();
    }
  });
};

features.add(featureId, {
  include: [isGithub, isPublicRepo],
  awaitDomReady: false,
  init,
});
