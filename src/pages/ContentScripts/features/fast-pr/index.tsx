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

const CACHE_KEY = 'matchedUrlCache';
const CACHE_EXPIRY = 60 * 60 * 1000;

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
const iframePostMessage = (command: string, matchedFun: string | null, url: string) => {
  const iframeElement = document.getElementById('sandboxFrame') as HTMLIFrameElement;
  if (iframeElement && iframeElement.contentWindow) {
    iframeElement.contentWindow.postMessage({ command: command, matchedFun: matchedFun, url: url }, '*');
  }
};
const checkCacheAndInit = (url: string) => {
  const cachedData = localStorage.getItem(CACHE_KEY);
  const currentTime = Date.now();
  if (cachedData) {
    const { matchedFun, timestamp } = JSON.parse(cachedData);
    if (currentTime - timestamp < CACHE_EXPIRY) {
      iframePostMessage('useCachedData', matchedFun, url);
    } else {
      iframePostMessage('requestMatchedUrl', null, url);
    }
    return;
  }
  iframePostMessage('requestMatchedUrl', null, url);
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
  checkCacheAndInit(url);
}

window.addEventListener('message', (event: MessageEvent) => {
  if (event.data && event.data.matchedFun && event.data.isUpdated) {
    const matchedFun = event.data.matchedFun;
    const currentTime = Date.now();
    localStorage.setItem(CACHE_KEY, JSON.stringify({ matchedFun, timestamp: currentTime }));
  }
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
      const url = window.location.href;
      checkCacheAndInit(url);
    };
  },
});
