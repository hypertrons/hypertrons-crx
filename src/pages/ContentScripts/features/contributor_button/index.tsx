/**
 * This module is responsible for enhancing the contributor list on the GitHub repository page.
 * It uses React to render the contributor list and fetches additional network data through the API.
 */

import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import View from './view';
import { getRepoName } from '../../../../helpers/get-repo-info';
import { getDeveloperNetwork, getRepoNetwork } from '../../../../api/repo';
import features from '../../../../feature-manager';
import * as pageDetect from 'github-url-detection';
import elementReady from 'element-ready';

// Global variables are used to store the repository name and network data for sharing between different functions.
// Define global variables to store the repository name and network data.
let repoName: string;
let developerNetworks: any;
let repoNetworks: any;
let target: any;

// Get the feature ID of the current module for feature management.
const featureId = features.getFeatureID(import.meta.url);

/**
 * Asynchronously fetch network data of the repository developer and the repository.
 */
const getData = async () => {
  developerNetworks = await getDeveloperNetwork(repoName);
  repoNetworks = await getRepoNetwork(repoName);
};

/**
 * Replace the contributor list with a React component.
 * @param target The target element to be replaced.
 */
const renderTo = (target: HTMLElement) => {
  const originalHTML = target.innerHTML;

  render(
    <React.Fragment>
      <View developerNetwork={developerNetworks} target={originalHTML} />
    </React.Fragment>,
    document.querySelector('.list-style-none.d-flex.flex-wrap.mb-n2') as HTMLElement
  );
};

/**
 * Initialize the feature, including fetching the repository name and data, and replacing the contributor list.
 */
const init = async (): Promise<void> => {
  repoName = getRepoName();
  const targetElement = document.querySelector('.list-style-none.d-flex.flex-wrap.mb-n2') as HTMLElement;
  await getData();
  renderTo(targetElement);
};

/**
 * Restore the feature when the page is refreshed or navigated, reload the data and render the list.
 */
const restore = async () => {
  if (repoName !== getRepoName()) {
    repoName = getRepoName();
    await getData();
  }
  $('div.ReactModalPortal').remove();
  renderTo(target);
};

// Add the feature to the feature manager, configure the initialization and restore functions.
features.add(featureId, {
  //   asLongAs: [pageDetect.isUserProfile],
  awaitDomReady: false,
  init,
  restore,
});
