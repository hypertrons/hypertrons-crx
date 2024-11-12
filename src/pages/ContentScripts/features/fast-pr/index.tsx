import React from 'react';
import { createRoot } from 'react-dom/client';
import features from '../../../../feature-manager';
import View from './view';
import i18n from '../../../../helpers/i18n';
const featureId = features.getFeatureID(import.meta.url);
const t = i18n.t;
interface MatchedUrl {
  filePath: string;
  repoName: string;
  branch: string;
  platform: string;
  horizontalRatio: number;
  verticalRatio: number;
}

const renderTo = (
  container: HTMLElement,
  filePath: string,
  repoName: string,
  branch: string,
  platform: string,
  horizontalRatio: number,
  verticalRatio: number
) => {
  createRoot(container).render(
    <View
      filePath={filePath}
      originalRepo={repoName}
      branch={branch}
      platform={platform}
      horizontalRatio={horizontalRatio}
      verticalRatio={verticalRatio}
    />
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
    renderTo(
      container,
      matchedUrl.filePath,
      matchedUrl.repoName,
      matchedUrl.branch,
      matchedUrl.platform,
      matchedUrl.horizontalRatio,
      matchedUrl.verticalRatio
    );
    document.body.appendChild(container);
  }
};
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'urlChanged') {
    handleUrlChange(message.url);
  }
});
function handleUrlChange(url: string) {
  const existingContainer = document.getElementById(featureId);
  if (existingContainer) {
    existingContainer.remove();
  }
  const iframe = document.getElementById('sandboxFrame') as HTMLIFrameElement;
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({ command: 'matchUrl', url: url }, '*');
  }
}
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
  },
});
