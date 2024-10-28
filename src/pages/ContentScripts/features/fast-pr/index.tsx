import React from 'react';
import { createRoot } from 'react-dom/client';
import features from '../../../../feature-manager';
import { matchFastPrUrl } from '../../../../helpers/fastPR-url-rules';
import View from './view';

const featureId = features.getFeatureID(import.meta.url);

const renderTo = (container: any, filePath: string, repoName: string, branch: string, platform: string) => {
  createRoot(container).render(
    <View filePath={filePath} originalRepo={repoName} branch={branch} platform={platform} />
  );
};

const init = async () => {
  const currentUrl = window.location.href; // Get the current page URL
  const matchedUrl = matchFastPrUrl(currentUrl);
  //Find and delete previous View components here
  const existingContainer = document.getElementById(featureId);
  if (existingContainer) {
    existingContainer.remove();
  }
  if (matchedUrl) {
    const container = document.createElement('div');
    container.id = featureId;
    renderTo(container, matchedUrl.filePath, matchedUrl.repoName, matchedUrl.branch, matchedUrl.platform);
    document.body.appendChild(container);
  } else {
    return;
  }
};
const observeUrlChanges = () => {
  let lastUrl = window.location.href;

  const observer = new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      init();
    }
  });

  //Observe changes in the main body of the document
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

features.add(featureId, {
  awaitDomReady: false,
  init: async () => {
    await init();
    observeUrlChanges();
  },
});
