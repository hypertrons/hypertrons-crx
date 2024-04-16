import features from '../../../../feature-manager';
import View, { IssueDetail } from './view';
import { NativePopover } from '../../components/NativePopover';
import elementReady from 'element-ready';
import {
  getRepoName,
  isPublicRepoWithMeta,
} from '../../../../helpers/get-repo-info';
import {
  getIssuesOpened,
  getIssuesClosed,
  getIssueComments,
} from '../../../../api/repo';

import { RepoMeta, metaStore } from '../../../../api/common';

import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';

const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let issueDetail: IssueDetail = {
  issuesOpened: null,
  issuesClosed: null,
  issueComments: null,
};
let meta: RepoMeta;

const getData = async () => {
  issueDetail.issuesOpened = await getIssuesOpened(repoName);
  issueDetail.issuesClosed = await getIssuesClosed(repoName);
  issueDetail.issueComments = await getIssueComments(repoName);
  meta = (await metaStore.get(repoName)) as RepoMeta;
};

const init = async (): Promise<void> => {
  repoName = getRepoName();
  await getData();

  await elementReady('#issues-tab');
  const $issueTab = $('#issues-tab');
  const placeholderElement = $('<div class="NativePopover" />').appendTo(
    'body'
  )[0];
  render(
    <NativePopover anchor={$issueTab} width={310} arrowPosition="top-middle">
      <View currentRepo={repoName} issueDetail={issueDetail} meta={meta} />
    </NativePopover>,
    placeholderElement
  );
};

const restore = async () => {};

features.add(featureId, {
  asLongAs: [isPublicRepoWithMeta],
  awaitDomReady: false,
  init,
  restore,
});
