import React from 'react';
import { Container, render } from 'react-dom';
import $ from 'jquery';

import features from '../../../../feature-manager';
import isPerceptor from '../../../../helpers/is-perceptor';
import { getRepoName, isPublicRepoWithMeta } from '../../../../helpers/get-repo-info';
import { getOpenRank } from '../../../../api/community';
import View from './view';
import { CommunityOpenRankDetails } from './data';

const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let communityOpenRankDetails: CommunityOpenRankDetails = {};

const getData = async () => {
  repoName = getRepoName();
  for (let year = 2020; year <= 2024; year++) {
    for (let month = 1; month <= 12; month++) {
      let date = year.toString() + '-' + String(month).padStart(2, '0');
      const rawData = await getOpenRank(repoName, date);
      if (rawData !== null) {
        communityOpenRankDetails[date] = rawData.nodes.map((node: any) => [node.n, node.c, node.v]);
      }
    }
  }
};

const renderTo = (container: Container) => {
  render(<View communityOpenRankDetails={communityOpenRankDetails} />, container);
};

const init = async (): Promise<void> => {
  await getData();
  const container = document.createElement('div');
  container.id = featureId;

  $('#hypercrx-perceptor-slot-community-openrank-racing-bar').append(container);
  renderTo(container);
};

const restore = async () => {
  // Clicking another repo link in one repo will trigger a turbo:visit,
  // so in a restoration visit we should be careful of the current repo.
  if (repoName !== getRepoName()) {
    repoName = getRepoName();
  }
  // rerender the chart or it will be empty
  renderTo($(`#${featureId}`)[0]);
};

features.add(featureId, {
  asLongAs: [isPerceptor, isPublicRepoWithMeta],
  awaitDomReady: false,
  init,
  restore,
});
