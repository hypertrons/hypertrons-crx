import React from 'react';
import { createRoot } from 'react-dom/client';
import features from '../../../../feature-manager';
import View from './view';
import { handleMessage } from './handleMessage';
import i18n from '../../../../helpers/i18n';
const featureId = features.getFeatureID(import.meta.url);
const t = i18n.t;
interface MatchedUrl {
  filePath: string;
  repoName: string;
  branch: string;
  platform: string;
}

const renderTo = (container: HTMLElement, filePath: string, repoName: string, branch: string, platform: string) => {
  createRoot(container).render(
    <View filePath={filePath} originalRepo={repoName} branch={branch} platform={platform} />
  );
};

const init = async (matchedUrl: MatchedUrl | null) => {
  const existingContainer = document.getElementById(featureId);
  if (existingContainer) {
    existingContainer.remove();
  }
  if (matchedUrl) {
    const container = document.createElement('div');
    container.id = featureId;
    renderTo(container, matchedUrl.filePath, matchedUrl.repoName, matchedUrl.branch, matchedUrl.platform);
    document.body.appendChild(container);
  }
};
const observeUrlChanges = () => {
  let lastUrl = window.location.href;
  const observer = new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      const existingContainer = document.getElementById(featureId);
      if (existingContainer) {
        existingContainer.remove();
      }
      const iframe = document.getElementById('sandboxFrame') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ command: 'matchUrl', url: currentUrl }, '*');
      }
    }
  });

  //Observe changes in the main body of the document
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

window.addEventListener('message', (event: MessageEvent) => {
  if (event.data && event.data.matchedUrl) {
    init(event.data.matchedUrl);
  }
});

features.add(featureId, {
  awaitDomReady: false,
  init: async () => {
    const iframe = document.createElement('iframe');
    iframe.id = 'sandboxFrame';
    iframe.src = chrome.runtime.getURL('sandbox.html');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.onload = () => {
      const currentUrl = window.location.href;
      const iframeElement = document.getElementById('sandboxFrame') as HTMLIFrameElement;
      setTimeout(() => {
        if (iframeElement && iframeElement.contentWindow) {
          iframeElement.contentWindow.postMessage({ command: 'matchUrl', url: currentUrl }, '*');
        }
      }, 500);
    };
    observeUrlChanges();
  },
});
