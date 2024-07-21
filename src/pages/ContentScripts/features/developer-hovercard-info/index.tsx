import features from '../../../../feature-manager';
import { getOpenrank } from '../../../../api/developer';
import elementReady from 'element-ready';
import React from 'react';
import ReactDOM from 'react-dom';
import View from './view';

const featureId = features.getFeatureID(import.meta.url);

const getDeveloperLatestOpenrank = async (developerName: string): Promise<string | null> => {
  const data = await getOpenrank(developerName);
  if (data) {
    const values = Object.values(data) as string[];
    const latestValue = values[values.length - 1];
    return latestValue;
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
  const openRankContainer = document.createElement('div');
  container.appendChild(openRankContainer);
  ReactDOM.render(<View developerName={developerName} openrank={openrank} />, openRankContainer);
};

const init = async (): Promise<void> => {
  const hovercardSelector = '[data-hovercard-type="user"]';
  document.querySelectorAll(hovercardSelector).forEach((element) => {
    // isProcessing is used to Prevent OpenRank from adding duplicates
    let isProcessing = false;

    element.addEventListener('mouseover', async () => {
      if (isProcessing) {
        return;
      }
      isProcessing = true;

      const developerName = getDeveloperName(element as HTMLElement) as string;

      // Create a unique identifier for the popover
      const popoverId = `popover-${developerName}`;

      // Get the floating card container
      const $popoverContainer =
        'body > div.logged-in.env-production.page-responsive > div.Popover.js-hovercard-content.position-absolute > div > div > div';
      const popover = await elementReady($popoverContainer, { stopOnDomReady: false });

      const openRankDiv = popover?.querySelector('.openrank-info-container');
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
        isProcessing = false;
        return;
      }

      if (popover && popover.getAttribute('data-popover-id') === popoverId) {
        // Check if the popover is still associated with the correct developer
        renderTo(popover, developerName, openrank);
      }

      // Regardless of whether the current event is being processed, check and update the openrank information if necessary.
      isProcessing = false;
    });
  });
};

features.add(featureId, {
  awaitDomReady: false,
  init,
});
