import features from '../../../../feature-manager';
import View, { IssueDetail } from './view';
import { NativePopover } from '../../components/NativePopover';
import elementReady from 'element-ready';
import { getRepoName, isPublicRepoWithMeta } from '../../../../helpers/get-github-repo-info';
import { getIssuesOpened, getIssuesClosed, getIssueComments } from '../../../../api/repo';

import { RepoMeta, metaStore } from '../../../../api/common';

import React from 'react';
import { createRoot } from 'react-dom/client';
import $ from 'jquery';
import isGithub from '../../../../helpers/is-github';
import { getPlatform } from '../../../../helpers/get-platform';

const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let issueDetail: IssueDetail = {
  issuesOpened: null,
  issuesClosed: null,
  issueComments: null,
};
let meta: RepoMeta;
let platform: string;
const getData = async () => {
  issueDetail.issuesOpened = await getIssuesOpened(platform, repoName);
  issueDetail.issuesClosed = await getIssuesClosed(platform, repoName);
  issueDetail.issueComments = await getIssueComments(platform, repoName);
  meta = (await metaStore.get(platform, repoName)) as RepoMeta;
};

const init = async (): Promise<void> => {
  repoName = getRepoName();
  platform = getPlatform();
  await getData();

  await elementReady('#issues-tab');
  const $issueTab = $('#issues-tab');
  const placeholderElement = $('<div class="NativePopover" />').appendTo('body')[0];
  createRoot(placeholderElement).render(
    <NativePopover anchor={$issueTab} width={310} arrowPosition="top-middle">
      <View currentRepo={repoName} issueDetail={issueDetail} meta={meta} />
    </NativePopover>
  );
};

const restore = async () => {};

features.add(featureId, {
  asLongAs: [isGithub, isPublicRepoWithMeta],
  awaitDomReady: false,
  init,
  restore,
});
