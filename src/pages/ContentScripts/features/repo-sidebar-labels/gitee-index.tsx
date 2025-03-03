import features from '../../../../feature-manager';
import { getRepoName, hasRepoContainerHeader, isPublicRepoWithMeta } from '../../../../helpers/get-gitee-repo-info';
import { Label, RepoMeta, metaStore } from '../../../../api/common';
import { createRoot } from 'react-dom/client';
import OpenDiggerLabel from './gitee-OpenDiggerLabel';

import React from 'react';
import $ from 'jquery';
import isGitee from '../../../../helpers/is-gitee';
import { getPlatform } from '../../../../helpers/get-platform';
const featureId = features.getFeatureID(import.meta.url);
let platform: string;
const getLabels = async (repoName: string) => {
  const meta = (await metaStore.get(platform, repoName)) as RepoMeta;
  return meta.labels?.filter((label) => {
    return !(label.type.includes('-') && parseInt(label.type.split('-')[1]) > 0);
  });
};

const renderTags = (labels: Label[]) => {
  const defaultDiv = document.querySelector('.intro-list .default') as HTMLElement;
  if (defaultDiv) {
    defaultDiv.style.display = 'none';
    $('.mixed-label').css('display', 'block');
  }

  let giteeTagContainer = $('.mixed-label');
  for (const label of labels) {
    const id = `opendigger-label-${label.id}`;
    // if the tag already exists, skip
    if (document.getElementById(id)) {
      continue;
    }
    const labelElement = document.createElement('span');
    createRoot(labelElement).render(<OpenDiggerLabel label={label} />);
    giteeTagContainer.append(labelElement);
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
  asLongAs: [isGitee, isPublicRepoWithMeta, hasRepoContainerHeader],
  awaitDomReady: true,
  init,
});
