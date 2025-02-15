import features from '../../../../feature-manager';
import { getRepoName, hasRepoContainerHeader, isPublicRepoWithMeta } from '../../../../helpers/get-github-repo-info';
import { Label, RepoMeta, metaStore } from '../../../../api/common';
import { createRoot } from 'react-dom/client';
import OpenDiggerLabel from './OpenDiggerLabel';

import React from 'react';
import $ from 'jquery';
import isGithub from '../../../../helpers/is-github';
import { getPlatform } from '../../../../helpers/get-platform';
const featureId = features.getFeatureID(import.meta.url);
let platform: string;
const getLabels = async (repoName: string) => {
  const meta = (await metaStore.get(platform, repoName)) as RepoMeta;
  // filtered all xxx-n and n is not 0
  return meta.labels?.filter((label) => {
    return !(label.type.includes('-') && parseInt(label.type.split('-')[1]) > 0);
  });
};

const renderTags = (labels: Label[]) => {
  let githubTagContainer = $('.topic-tag.topic-tag-link').parent();
  // some repositories don't have tags, create a tag container for our tags
  if (githubTagContainer.length === 0) {
    githubTagContainer = $('<div class="f6"></div>');
    const githubTagContainerWrap = $('<div class="my-3"></div>');
    githubTagContainerWrap.append(githubTagContainer);
    const anchor = $('h3.sr-only:contains("Resources")');
    githubTagContainerWrap.insertBefore(anchor);
  }
  for (const label of labels) {
    const id = `opendigger-label-${label.id}`;
    // if the tag already exists, skip
    if (document.getElementById(id)) {
      continue;
    }
    const labelElement = document.createElement('span');
    createRoot(labelElement).render(<OpenDiggerLabel label={label} />);
    githubTagContainer.append(labelElement);
  }
};

const init = async (): Promise<void> => {
  platform = getPlatform();
  const repoName = getRepoName();
  const labels = await getLabels(repoName);
  if (labels && labels.length > 0) {
    renderTags(labels);
  }
};

features.add(featureId, {
  asLongAs: [isGithub, isPublicRepoWithMeta, hasRepoContainerHeader],
  awaitDomReady: true,
  init,
});
