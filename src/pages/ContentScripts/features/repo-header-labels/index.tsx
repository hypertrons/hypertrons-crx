import React from 'react';
import { render, Container } from 'react-dom';
import elementReady from 'element-ready';
import $ from 'jquery';

import features from '../../../../feature-manager';
import {
  getRepoName,
  isPublicRepoWithMeta,
} from '../../../../helpers/get-repo-info';
import { getActivity, getOpenrank, getParticipant } from '../../../../api/repo';
import { RepoMeta, metaStore } from '../../../../api/common';
import View from './view';

const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let activity: any;
let openrank: any;
let participant: any;
let meta: RepoMeta;

const getData = async () => {
  activity = await getActivity(repoName);
  openrank = await getOpenrank(repoName);
  participant = await getParticipant(repoName);
  meta = (await metaStore.get(repoName)) as RepoMeta;
};

const renderTo = (container: Container) => {
  render(
    <View
      activity={activity}
      openrank={openrank}
      participant={participant}
      meta={meta}
    />,
    container
  );
};

const init = async (): Promise<void> => {
  repoName = getRepoName();
  await getData();

  const container = document.createElement('div');
  container.id = featureId;
  renderTo(container);
  await elementReady('#repository-container-header');
  $('#repository-container-header')
    .find('span.Label.Label--secondary')
    .after(container);
};

const restore = async () => {
  // Clicking another repo link in one repo will trigger a turbo:visit,
  // so in a restoration visit we should be careful of the current repo.
  if (repoName !== getRepoName()) {
    repoName = getRepoName();
    await getData();
  }
  // Ideally, we should do nothing if the container already exists. But after a tubor
  // restoration visit, tooltip cannot be triggered though it exists in DOM tree. One
  // way to solve this is to rerender the view to the container. At least this way works.
  renderTo($(`#${featureId}`)[0]);
};

features.add(featureId, {
  asLongAs: [isPublicRepoWithMeta],
  awaitDomReady: false,
  init,
  restore,
});
