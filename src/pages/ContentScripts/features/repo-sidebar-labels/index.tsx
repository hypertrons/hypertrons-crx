import features from '../../../../feature-manager';
import elementReady from 'element-ready';
import { getRepoName, getRepoSidebarSection, isPublicRepoWithMeta } from '../../../../helpers/get-github-repo-info';
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
  const $sidebarSection = getRepoSidebarSection();
  if ($sidebarSection.length === 0) {
    return;
  }

  let githubTagContainer = $sidebarSection.find('.topic-tag.topic-tag-link').parent().first();
  // some repositories don't have tags, create a tag container for our tags
  if (githubTagContainer.length === 0) {
    githubTagContainer = $('<div class="f6"></div>');
    const githubTagContainerWrap = $('<div class="tmp-my-3"></div>');
    githubTagContainerWrap.append(githubTagContainer);
    const resourcesHeading = $sidebarSection
      .find('h3.sr-only')
      .filter((_, element) => $(element).text().trim().toLowerCase() === 'resources')
      .first();
    const readmeResourceRow = $sidebarSection
      .find('a[href="#readme-ov-file"], a[data-analytics-event*="file:readme"]')
      .first()
      .closest('div');
    const insertionAnchor = resourcesHeading.length > 0 ? resourcesHeading : readmeResourceRow;

    if (insertionAnchor.length > 0) {
      $('<h3 class="sr-only">Topics</h3>').insertBefore(insertionAnchor);
      githubTagContainerWrap.insertBefore(insertionAnchor);
    } else {
      $sidebarSection.append('<h3 class="sr-only">Topics</h3>');
      $sidebarSection.append(githubTagContainerWrap);
    }
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
  await elementReady('.BorderGrid-cell, .Layout-sidebar');
  const labels = await getLabels(repoName);
  if (labels && labels.length > 0) {
    renderTags(labels);
  }
};

features.add(featureId, {
  asLongAs: [isGithub, isPublicRepoWithMeta],
  awaitDomReady: true,
  init,
});
