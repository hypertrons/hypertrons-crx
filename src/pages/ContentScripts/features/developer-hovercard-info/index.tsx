import features from '../../../../feature-manager';
import { getOpenrank } from '../../../../api/developer';
import elementReady from 'element-ready';
import React from 'react';
import View from './view';
import { createRoot } from 'react-dom/client';
import isGithub from '../../../../helpers/is-github';
import { getPlatform } from '../../../../helpers/get-platform';
const featureId = features.getFeatureID(import.meta.url);
let isInitialized = false;
let platform: string;
const getDeveloperLatestOpenrank = async (developerName: string): Promise<string | null> => {
  const data = await getOpenrank(platform, developerName);
  if (data) {
    // filter YYYY-MM
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

const getDeveloperName = (target: HTMLElement): string | null => {
  const hovercardUrlAttribute = target.getAttribute('data-hovercard-url');
  if (!hovercardUrlAttribute) return null;

  const matches = hovercardUrlAttribute.match(/\/users\/([^\/]+)\/hovercard/);
  return matches ? matches[1] : null;
};

const renderTo = (container: HTMLElement, developerName: string, openrank: string) => {
  const parentElement = container.parentNode?.parentElement?.parentElement;
  const hovercardUrl = parentElement?.getAttribute('data-hovercard-target-url');
  if (!hovercardUrl || !hovercardUrl.startsWith('/users')) {
    return;
  }
  const openRankContainer = document.createElement('div');
  container.appendChild(openRankContainer);
  createRoot(openRankContainer).render(<View developerName={developerName} openrank={openrank} />);
};

const elementReadyWithTimeout = async (selector: string, options: { stopOnDomReady: boolean }, timeout: number) => {
  return Promise.race([
    elementReady(selector, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout waiting for ${selector}`)), timeout)),
  ]);
};

const processElement = (element: Element) => {
  const hovercardUrl = element.getAttribute('data-hovercard-url');
  if (!hovercardUrl || !hovercardUrl.startsWith('/users')) {
    return;
  }

  let abortController = new AbortController();

  element.addEventListener('mouseover', async () => {
    abortController.abort();
    abortController = new AbortController();
    const signal = abortController.signal;
    await new Promise((resolve) => setTimeout(resolve, 600));

    const developerName = getDeveloperName(element as HTMLElement) as string;

    // Create a unique identifier for the popover
    const popoverId = `popover-${developerName}`;

    // Get the floating card container
    const $popoverContainer =
      'body > div.logged-in.env-production.page-responsive > div.Popover.js-hovercard-content.position-absolute > div > div > div';
    const popover = await elementReady($popoverContainer, { stopOnDomReady: false });

    const openRankDiv = popover?.querySelector('.hypercrx-openrank-info');
    const existingDeveloperName = openRankDiv?.getAttribute('data-developer-name');
    if (existingDeveloperName === developerName) {
      return;
    }
    openRankDiv?.remove();

    // Set the popover's unique identifier
    // make the current OpenRank information and person match
    popover?.setAttribute('data-popover-id', popoverId);

    const openrank = await getDeveloperLatestOpenrank(developerName);

    if (!openrank) {
      return;
    }

    if (!signal.aborted && popover && popover.getAttribute('data-popover-id') === popoverId) {
      // Check if the popover is still associated with the correct developer
      renderTo(popover, developerName, openrank);
    }
  });
};

const init = async (): Promise<void> => {
  platform = getPlatform();
  if (isInitialized) return;
  isInitialized = true;

  const hovercardSelector = '[data-hovercard-url]';

  await elementReady(hovercardSelector, { stopOnDomReady: false });
  try {
    await elementReadyWithTimeout('[data-testid=github-avatar]', { stopOnDomReady: false }, 1500);
  } catch (error) {
    console.log('The current interface does not have data-testid=github-avatar information');
  }

  // Initial processing of existing elements
  document.querySelectorAll(hovercardSelector).forEach(processElement);

  // Use MutationObserver to monitor dynamically added elements
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const newElements = node.querySelectorAll(hovercardSelector);
            newElements.forEach(processElement);
          }
        });
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

features.add(featureId, {
  asLongAs: [isGithub],
  awaitDomReady: false,
  init,
});
