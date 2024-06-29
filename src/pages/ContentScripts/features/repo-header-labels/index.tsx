import features from '../../../../feature-manager';
import View from './view';
import ActivityView from './activityView';
import OpenrankView from './openrankView';
import ParticipantView from './participantView';
import { NativePopover } from '../../components/NativePopover';
import elementReady from 'element-ready';
import { getRepoName, hasRepoContainerHeader, isPublicRepoWithMeta } from '../../../../helpers/get-repo-info';
import { getActivity, getOpenrank, getParticipant, getContributor } from '../../../../api/repo';
import { RepoMeta, metaStore } from '../../../../api/common';
import React from 'react';
import { render, Container } from 'react-dom';
import $ from 'jquery';

const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let activity: any;
let openrank: any;
let participant: any;
let contributor: any;
let meta: RepoMeta;

const getData = async () => {
  activity = await getActivity(repoName);
  openrank = await getOpenrank(repoName);
  participant = await getParticipant(repoName);
  contributor = await getContributor(repoName);
  meta = (await metaStore.get(repoName)) as RepoMeta;
};

const renderTo = (container: Container) => {
  render(
    <View activity={activity} openrank={openrank} participant={participant} contributor={contributor} meta={meta} />,
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
  $('#repository-container-header').find('span.Label').after(container);

  await elementReady('#activity-header-label');
  await elementReady('#OpenRank-header-label');
  await elementReady('#participant-header-label');
  const placeholderElement = $('<div class="NativePopover" />').appendTo('body')[0];

  render(
    <>
      <NativePopover anchor={$('#activity-header-label')} width={280} arrowPosition="top-middle">
        <ActivityView activity={activity} meta={meta} />
      </NativePopover>
      <NativePopover anchor={$('#OpenRank-header-label')} width={280} arrowPosition="top-middle">
        <OpenrankView openrank={openrank} meta={meta} />
      </NativePopover>
      <NativePopover anchor={$('#participant-header-label')} width={280} arrowPosition="top-middle">
        <ParticipantView participant={participant} contributor={contributor} meta={meta} />
      </NativePopover>
    </>,
    placeholderElement
  );
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
  asLongAs: [isPublicRepoWithMeta, hasRepoContainerHeader],
  awaitDomReady: false,
  init,
  restore,
});
