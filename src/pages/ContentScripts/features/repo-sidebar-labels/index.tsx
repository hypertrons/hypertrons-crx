import features from '../../../../feature-manager';
import { getRepoName, hasRepoContainerHeader, isPublicRepoWithMeta } from '../../../../helpers/get-repo-info';
import { CommonMeta, RepoMeta, metaStore } from '../../../../api/common';
import { createRoot } from 'react-dom/client';
import OpenDiggerLabel from './OpenDiggerLabel';

import React from 'react';
import $ from 'jquery';

const featureId = features.getFeatureID(import.meta.url);

let repoName: string;
let meta: RepoMeta;
let filteredLabels: CommonMeta['labels'];

const getData = async () => {
  meta = (await metaStore.get(repoName)) as RepoMeta;
  // filtered all xxx-n and n is not 0
  filteredLabels = meta.labels.filter((label) => {
    return !(label.type.includes('-') && parseInt(label.type.split('-')[1]) > 0);
  });
};

const renderTags = () => {
  const githubTagContainer = $('.topic-tag.topic-tag-link').parent();
  for (const label of filteredLabels) {
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
  repoName = getRepoName();
  await getData();
  renderTags();
};

features.add(featureId, {
  asLongAs: [isPublicRepoWithMeta, hasRepoContainerHeader],
  awaitDomReady: false,
  init,
});
