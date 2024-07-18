import features from '../../../../feature-manager';
import { getOpenrank } from '../../../../api/developer';
import elementReady from 'element-ready';
import { renderOpenRank } from './view';

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

const init = async (): Promise<void> => {
  // Listen for elements with data-hovercard-type="user" attribute
  document.querySelectorAll('[data-hovercard-type="user"]').forEach((element) => {
    element.addEventListener('mouseover', async () => {
      const developerName = getDeveloperName(element as HTMLElement);
      if (!developerName) {
        console.error('Developer name not found');
        return;
      }

      // Get the floating card container
      const $popoverContainer =
        'body > div.logged-in.env-production.page-responsive > div.Popover.js-hovercard-content.position-absolute > div > div > div';
      const popover = await elementReady($popoverContainer, { stopOnDomReady: false });

      const openRankDiv = popover?.querySelector('.openrank-info-container');
      if (openRankDiv) {
        const existingDeveloperName = openRankDiv.getAttribute('data-developer-name');
        if (existingDeveloperName === developerName) {
          return;
        } else {
          openRankDiv.remove();
        }
      }

      const openrank = await getDeveloperLatestOpenrank(developerName);
      if (openrank === null) {
        console.error('Rank data not found');
        return;
      }

      if (popover) {
        renderOpenRank(popover, developerName, openrank);
      } else {
        console.error('Popover container not found');
      }
    });
  });
};

features.add(featureId, {
  awaitDomReady: false,
  init,
});
