import React from 'react';
import { Container, render } from 'react-dom';
import $ from 'jquery';

import features from '../../../../feature-manager';
import isPerceptor from '../../../../helpers/is-perceptor';
import { getRepoName, isPublicRepoWithMeta } from '../../../../helpers/get-repo-info';
import { getOpenRank } from '../../../../api/community';
import { getActivityDetails } from '../../../../api/repo';
import View from './view';
import DataNotFound from '../repo-networks/DataNotFound';
import { CommunityOpenRankDetails } from './data';
import { JsonObject } from 'type-fest';

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
const filterNodesByType = (data: CommunityOpenRankDetails, type: string): CommunityOpenRankDetails => {
  const filteredData: CommunityOpenRankDetails = {};

  for (const [date, nodes] of Object.entries(data)) {
    filteredData[date] = nodes.filter(([_, c]) => c === type);
  }

  return filteredData;
};
const filterByI = filterNodesByType(communityOpenRankDetails, 'i');
const filterByP = filterNodesByType(communityOpenRankDetails, 'p');
const filterByU = filterNodesByType(communityOpenRankDetails, 'u');
const renderTo = (container: Container) => {
  render(<View currentRepo={repoName} communityOpenRankDetails={communityOpenRankDetails} />, container);
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
