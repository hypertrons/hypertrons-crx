import features from '../../../../feature-manager';
import View from './view';
import { NativePopover } from '../../components/NativePopover';
import elementReady from 'element-ready';
import { getRepoName, hasRepoContainerHeader, isPublicRepoWithMeta } from '../../../../helpers/get-github-repo-info';
import {
  getActivity,
  getOpenrank,
  getParticipant,
  getContributor,
  getStars,
  getForks,
  getIssuesOpened,
  getIssuesClosed,
  getAttention,
  getIssueResolutionDuration,
  getIssueResponseTime,
} from '../../../../api/repo';
import { RepoMeta, metaStore } from '../../../../api/common';
import React from 'react';
import $ from 'jquery';
import { createRoot } from 'react-dom/client';
import isGithub from '../../../../helpers/is-github';
import { getPlatform } from '../../../../helpers/get-platform';
import AnalysisView from './analysisView';
const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let activity: any;
let star: any;
let frok: any;
let issuesOpened: any;
let issuesClosed: any;
let openrank: any;
let participant: any;
let contributor: any;
let attention: any;
let meta: RepoMeta;
let platform: string;
let issueResolutionDuration: any;
let issueResponseTime: any;

const getData = async () => {
  activity = await getActivity(platform, repoName);

  star = await getStars(platform, repoName);
  frok = await getForks(platform, repoName);

  issuesOpened = await getIssuesOpened(platform, repoName);
  issuesClosed = await getIssuesClosed(platform, repoName);

  issueResponseTime = await getIssueResponseTime(platform, repoName);
  issueResolutionDuration = await getIssueResolutionDuration(platform, repoName);

  openrank = await getOpenrank(platform, repoName);
  participant = await getParticipant(platform, repoName);
  contributor = await getContributor(platform, repoName);
  attention = await getAttention(platform, repoName);
  meta = (await metaStore.get(platform, repoName)) as RepoMeta;
};

const renderTo = (container: any) => {
  createRoot(container).render(
    <View
      activity={activity}
      openrank={openrank}
      attention={attention}
      participant={participant}
      contributor={contributor}
      meta={meta}
    />
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
  renderTo(container);
  await elementReady('#repository-container-header');
  $('#repository-container-header').find('span.Label').after(container);
  await waitForElement('#activity-header-label');

  const placeholderElement = $('<div class="NativePopover" />').appendTo('body')[0];
  createRoot(placeholderElement).render(
    <>
      <NativePopover anchor={$('#activity-header-label')} width={280} arrowPosition="top-middle">
        <AnalysisView
          activity={activity}
          openrank={openrank}
          attention={openrank}
          participant={participant}
          contributor={contributor}
          meta={meta}
        />
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
  renderTo($(`#${featureId}`)[0]);
};

const main = async () => {
  if (!isGithub() || !isPublicRepoWithMeta() || !hasRepoContainerHeader) {
    return;
  }
  init();
  restore();
};

main();

// features.add(featureId, {
//   asLongAs: [isGithub, isPublicRepoWithMeta, isRepoRoot],
//   awaitDomReady: true,
//   init,
//   restore,
// });
