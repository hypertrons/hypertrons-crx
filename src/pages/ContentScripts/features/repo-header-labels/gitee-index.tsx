import features from '../../../../feature-manager';
import View from './view';
import ActivityView from './activityView';
import OpenrankView from './openrankView';
import ParticipantView from './participantView';
import elementReady from 'element-ready';
import { getRepoName, hasRepoContainerHeader, isPublicRepoWithMeta } from '../../../../helpers/get-gitee-repo-info';
import { getActivity, getOpenrank, getParticipant, getContributor } from '../../../../api/repo';
import { RepoMeta, metaStore } from '../../../../api/common';
import React from 'react';
import $ from 'jquery';
import { createRoot } from 'react-dom/client';
import { getPlatform } from '../../../../helpers/get-platform';
import isGitee from '../../../../helpers/is-gitee';
import { GiteeNativePopover } from '../../components/GiteeNativePopover';
const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let activity: any;
let openrank: any;
let participant: any;
let contributor: any;
let meta: RepoMeta;
let platform: string;

const getData = async () => {
  activity = await getActivity(platform, repoName);
  openrank = await getOpenrank(platform, repoName);
  participant = await getParticipant(platform, repoName);
  contributor = await getContributor(platform, repoName);
  meta = (await metaStore.get(platform, repoName)) as RepoMeta;
};

const renderTo = (container: any) => {
  createRoot(container).render(
    <View activity={activity} openrank={openrank} participant={participant} contributor={contributor} meta={meta} />
  );
};
const waitForElement = (selector: string) => {
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
};
const init = async (): Promise<void> => {
  platform = getPlatform();
  repoName = getRepoName();
  await getData();
  const container = document.createElement('div');
  container.id = featureId;
  container.className = 'inline-label-container';
  renderTo(container);
  await elementReady('.git-project-header-container');
  $('.git-project-header-container .repository').after(container);
  await waitForElement('#activity-header-label');
  await waitForElement('#OpenRank-header-label');
  await waitForElement('#participant-header-label');
  const placeholderElement = $('<div class="NativePopover" />').appendTo('body')[0];
  createRoot(placeholderElement).render(
    <>
      <GiteeNativePopover anchor={$('#activity-header-label')} width={280} arrowPosition="bottom">
        <ActivityView activity={activity} meta={meta} />
      </GiteeNativePopover>
      <GiteeNativePopover anchor={$('#OpenRank-header-label')} width={280} arrowPosition="bottom">
        <OpenrankView openrank={openrank} meta={meta} />
      </GiteeNativePopover>
      <GiteeNativePopover anchor={$('#participant-header-label')} width={280} arrowPosition="bottom">
        <ParticipantView participant={participant} contributor={contributor} meta={meta} />
      </GiteeNativePopover>
    </>
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
  asLongAs: [isGitee, isPublicRepoWithMeta, hasRepoContainerHeader],
  awaitDomReady: false,
  init,
  restore,
});
