import features from '../../../../feature-manager';
import { getOpenrank } from '../../../../api/developer';
import React from 'react';
import View from './gitee-view';
import { createRoot } from 'react-dom/client';
import { getPlatform } from '../../../../helpers/get-platform';
import isGitee from '../../../../helpers/is-gitee';
const featureId = features.getFeatureID(import.meta.url);
let isInitialized = false;
let platform: string;

const getDeveloperLatestOpenrank = async (developerName: string): Promise<string | null> => {
  const data = await getOpenrank(platform, developerName);
  if (data) {
    const monthKeys = Object.keys(data).filter((key) => /^\d{4}-\d{2}$/.test(key));
    if (monthKeys.length === 0) {
      return null;
    }
    monthKeys.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const latestMonthKey = monthKeys[monthKeys.length - 1];
    return data[latestMonthKey];
  }
  return null;
};

const waitForValidPopover = async (): Promise<HTMLElement | null> => {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          const target = mutation.target as HTMLElement;
          if (target.classList.contains('popper-profile-card') && !target.classList.contains('hidden')) {
            observer.disconnect();
            resolve(target);
            return;
          }
        }
      }
    });

    observer.observe(document.body, {
      attributeFilter: ['class'],
      subtree: true,
      childList: true,
    });
  });
};

const processElement = async (element: Element) => {
  const developername = element.getAttribute('data-username');
  if (!developername) return;

  let abortController = new AbortController();

  element.addEventListener('mouseover', async () => {
    abortController.abort();
    abortController = new AbortController();

    const popover = (await Promise.race([waitForValidPopover()])) as HTMLElement;

    const cardUsername = popover.querySelector('.username')?.textContent?.replace('@', '');
    if (cardUsername !== developername) return;
    const existing = popover.querySelector(`[data-username="${developername}"]`);
    if (existing) return;

    const existingOpenRank = popover.querySelector('.hypercrx-openrank-info');
    if (existingOpenRank) return;

    const openrank = await getDeveloperLatestOpenrank(developername);
    if (!openrank) {
      return;
    }
    const footer = popover.querySelector('.popper-profile-card__content') as HTMLElement;
    if (footer && !footer.querySelector(`[data-username="${developername}"]`)) {
      const openrankContainer = document.createElement('div');
      openrankContainer.dataset.username = developername;
      footer.appendChild(openrankContainer);
      createRoot(openrankContainer).render(<View {...{ developerName: developername, openrank }} />);
    }
  });
};

const init = async (): Promise<void> => {
  platform = getPlatform();
  if (isInitialized) return;
  isInitialized = true;
  const hovercardSelector = 'a.js-popover-card[data-username]';

  const processExisting = () => {
    document.querySelectorAll(hovercardSelector).forEach((element) => {
      if (!element.hasAttribute('data-hypercrx-processed')) {
        element.setAttribute('data-hypercrx-processed', 'true');
        processElement(element);
      }
    });
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        processExisting();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
  });
};

features.add(featureId, {
  asLongAs: [isGitee],
  awaitDomReady: false,
  init,
});
