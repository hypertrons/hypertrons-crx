import features from '../../../../feature-manager';
import View from './view';
import ActivityView from './activityView';
import OpenrankView from './openrankView';
import ParticipantView from './participantView';
import { NativePopover } from '../../components/NativePopover';
import elementReady from 'element-ready';
import { getRepoName, isPublicRepoWithMeta } from '../../../../helpers/get-github-repo-info';
import { getActivity, getOpenrank, getParticipant, getContributor } from '../../../../api/repo';
import { RepoMeta, metaStore } from '../../../../api/common';
import React from 'react';
import $ from 'jquery';
import { createRoot } from 'react-dom/client';
import isGithub from '../../../../helpers/is-github';
import { getPlatform } from '../../../../helpers/get-platform';
const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let activity: any;
let openrank: any;
let participant: any;
let contributor: any;
let meta: RepoMeta;
let platform: string;
const repoTitleSelector = '#repo-title-component';
const repoTitleFallbackSelector = '#repository-container-header .flex-auto.min-width-0.width-fit';
const repoTitleContainerSelector = `${repoTitleSelector}, ${repoTitleFallbackSelector}`;

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
const getRepoTitleContainer = () => {
  const pickFirst = (selector: string) => {
    const $elements = $(selector).filter((_, element) => !element.closest('template'));
    const $visibleElements = $elements.filter(':visible');

    return ($visibleElements.length > 0 ? $visibleElements : $elements).first();
  };

  const $repoTitle = pickFirst(repoTitleSelector);
  if ($repoTitle.length > 0) {
    return $repoTitle;
  }

  return pickFirst(repoTitleFallbackSelector);
};
const mountHeaderLabels = (container: HTMLElement) => {
  const $repoTitleContainer = getRepoTitleContainer();

  if ($repoTitleContainer.length === 0) {
    return;
  }

  const $visibilityLabel = $repoTitleContainer.children('span.Label, .Label, [class*="Label--"]').last();

  if ($visibilityLabel.length > 0) {
    $visibilityLabel.after(container);
    return;
  }

  $repoTitleContainer.append(container);
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
  container.className = 'hypercrx-inline-label-container';
  renderTo(container);
  await elementReady(repoTitleContainerSelector);
  mountHeaderLabels(container);
  await waitForElement('#activity-header-label');
  await waitForElement('#OpenRank-header-label');
  await waitForElement('#participant-header-label');
  const placeholderElement = $('<div class="NativePopover" />').appendTo('body')[0];
  createRoot(placeholderElement).render(
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
  const container = $(`#${featureId}`)[0];
  if (!container) {
    return;
  }

  await elementReady(repoTitleContainerSelector);
  mountHeaderLabels(container);
  renderTo(container);
};

features.add(featureId, {
  asLongAs: [isGithub, isPublicRepoWithMeta],
  awaitDomReady: false,
  init,
  restore,
});
