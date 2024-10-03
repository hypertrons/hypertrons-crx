import features from '../../../../feature-manager';
import View from './view';
import elementReady from 'element-ready';
import { getRepoName, hasRepoContainerHeader, isPublicRepoWithMeta } from '../../../../helpers/get-repo-info';
import { RepoMeta, metaStore } from '../../../../api/common';
import React from 'react';
import $ from 'jquery';
import { createRoot } from 'react-dom/client';

const featureId = features.getFeatureID(import.meta.url);
type Label = {
  id: string;
  name: string;
  type: string;
};

let repoName: string;
let meta: RepoMeta;
let filteredLabels: Label[];

const getData = async () => {
  meta = (await metaStore.get(repoName)) as RepoMeta;
  // filtered all xxx-n and n is not 0
  filteredLabels = (meta.labels as Label[]).filter((label: Label) => {
    return !(label.type.includes('-') && parseInt(label.type.split('-')[1]) > 0);
  });
};

const renderTo = (container: any) => {
  createRoot(container).render(<View labels={filteredLabels} />);
};

const init = async (): Promise<void> => {
  repoName = getRepoName();
  await getData();
  const container = document.createElement('div');
  container.id = featureId;
  createRoot(container).render(<View labels={filteredLabels} />);

  await elementReady('.Layout-sidebar');
  $('.Layout-sidebar').find('p.f4.my-3').after(container);
};

const restore = async () => {
  if (repoName !== getRepoName()) {
    repoName = getRepoName();
    await getData();
  }
  renderTo($(`#${featureId}`)[0]);
};

features.add(featureId, {
  asLongAs: [isPublicRepoWithMeta, hasRepoContainerHeader],
  awaitDomReady: false,
  init,
  restore,
});
