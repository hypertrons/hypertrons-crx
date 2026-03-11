import $ from 'jquery';
import elementReady from 'element-ready';

import iconSvgPath from './icon-svg-path';
import features from '../../../../feature-manager';
import isPerceptor from '../../../../helpers/is-perceptor';
import { isPublicRepo } from '../../../../helpers/get-github-repo-info';
import sleep from '../../../../helpers/sleep';
import isGithub from '../../../../helpers/is-github';

const featureId = features.getFeatureID(import.meta.url);
const insightsTabSelectors = [
  'nav[aria-label="Repository"] a[data-tab-item="insights"]',
  'a.UnderlineNav-item#insights-tab',
].join(', ');
let highlightingListenerAttached = false;
let syncingPerceptorTab = false;
let navigationObserver: MutationObserver | null = null;
let observedRepositoryNavigation: HTMLElement | null = null;

const getInsightsTab = () => {
  const $tabs = $(insightsTabSelectors).filter((_, element) => !element.closest('template'));
  const $visibleTabs = $tabs.filter(':visible');

  return ($visibleTabs.length > 0 ? $visibleTabs : $tabs).first();
};

const getRepositoryNavigation = () => {
  const $navigations = $('nav[aria-label="Repository"]').filter((_, element) => !element.closest('template'));
  const $visibleNavigations = $navigations.filter(':visible');

  return ($visibleNavigations.length > 0 ? $visibleNavigations : $navigations).first();
};

const waitForMeasuredRepositoryNavigation = async (): Promise<HTMLElement | null> => {
  const repositoryNavigation = (await elementReady('nav[aria-label="Repository"]', {
    waitForChildren: false,
  })) as HTMLElement | null;

  if (!repositoryNavigation) {
    return null;
  }

  if (repositoryNavigation.dataset.overflowMeasured === 'true') {
    return repositoryNavigation;
  }

  await new Promise<void>((resolve) => {
    let observer: MutationObserver;
    const timeout = window.setTimeout(() => {
      observer.disconnect();
      resolve();
    }, 1500);

    observer = new MutationObserver(() => {
      if (repositoryNavigation.dataset.overflowMeasured === 'true') {
        window.clearTimeout(timeout);
        observer.disconnect();
        resolve();
      }
    });

    observer.observe(repositoryNavigation, {
      attributes: true,
      attributeFilter: ['data-overflow-measured'],
    });
  });

  return repositoryNavigation;
};

const addPerceptorTab = async (): Promise<void | false> => {
  // the creation of the Perceptor tab is based on the Insights tab
  await waitForMeasuredRepositoryNavigation();
  await elementReady(insightsTabSelectors, { waitForChildren: false });
  const $insightsTab = getInsightsTab();
  const insightsTab = $insightsTab[0] as HTMLAnchorElement | undefined;
  if (!insightsTab) {
    return false;
  }

  $(`#${featureId}`).closest('li').remove();

  const insightTabListItem = insightsTab.closest('li');
  const perceptorTabListItem =
    (insightTabListItem?.cloneNode(true) as HTMLElement | null) ?? document.createElement('li');
  const perceptorTab = (perceptorTabListItem.querySelector('a') ?? insightsTab.cloneNode(true)) as HTMLAnchorElement;
  if (!perceptorTabListItem.contains(perceptorTab)) {
    perceptorTabListItem.appendChild(perceptorTab);
  }

  delete perceptorTab.dataset.selectedLinks;
  delete perceptorTab.dataset.reactNav;
  delete perceptorTab.dataset.reactNavAnchor;
  delete perceptorTab.dataset.hotkey;
  perceptorTab.removeAttribute('aria-current');
  perceptorTab.classList.remove('selected');
  const perceptorUrl = new URL(insightsTab.href);
  perceptorUrl.searchParams.set('redirect', 'perceptor');
  const perceptorHref = perceptorUrl.toString();
  perceptorTab.href = perceptorHref;
  perceptorTab.id = featureId;
  perceptorTab.setAttribute('data-tab-item', 'perceptor');
  perceptorTab.setAttribute(
    'data-analytics-event',
    `{"category":"Underline navbar","action":"Click tab","label":"Perceptor","target":"UNDERLINE_NAV.TAB"}`
  );
  const perceptorTitle = $('[data-content]', perceptorTab);
  perceptorTitle.text('Perceptor').attr('data-content', 'Perceptor');

  // slot for any future counter function
  const perceptorCounter = $('[class=Counter], [data-component="counter"]', perceptorTab);
  perceptorCounter.attr('id', `${featureId}-count`);

  // replace with the perceptor Icon
  $('svg.octicon', perceptorTab).html(iconSvgPath);

  // add the Perceptor tab to the tabs list
  if (!insightTabListItem?.parentElement) {
    return false;
  }
  insightTabListItem.after(perceptorTabListItem);
  // Trigger a reflow to push the right-most tab into the overflow dropdown
  window.dispatchEvent(new Event('resize'));
};

const updatePerceptorTabHighlighting = async (): Promise<void> => {
  const insightsTab = getInsightsTab();
  const perceptorTab = $(`#${featureId}`);
  // no operation needed
  if (!isPerceptor() || perceptorTab.length === 0 || insightsTab.length === 0) return;
  // if perceptor tab
  if (insightsTab.hasClass('selected')) {
    insightsTab.removeClass('selected');
    insightsTab.removeAttr('aria-current');
    perceptorTab.attr('aria-current', 'page');
    perceptorTab.addClass('selected');
  }

  if (insightsTab.attr('aria-current') === 'page') {
    insightsTab.removeAttr('aria-current');
    perceptorTab.attr('aria-current', 'page');
  }

  const insightsTabSeletedLinks = insightsTab.attr('data-selected-links');
  insightsTab.removeAttr('data-selected-links');
  perceptorTab.attr('data-selected-links', 'pulse');
  // should wait a short time for the host code to update the tab highlighting first
  await sleep(10);
  if (!insightsTabSeletedLinks) return;
  insightsTab.attr('data-selected-links', insightsTabSeletedLinks);
  perceptorTab.removeAttr('data-selected-links');
};

const syncPerceptorTab = async (): Promise<void> => {
  if (syncingPerceptorTab) {
    return;
  }

  syncingPerceptorTab = true;
  try {
    await addPerceptorTab();
    await updatePerceptorTabHighlighting();
  } finally {
    syncingPerceptorTab = false;
  }
};

const observeRepositoryNavigation = async (): Promise<void> => {
  const repositoryNavigation = await waitForMeasuredRepositoryNavigation();
  if (!repositoryNavigation || repositoryNavigation === observedRepositoryNavigation) {
    return;
  }

  navigationObserver?.disconnect();
  observedRepositoryNavigation = repositoryNavigation as HTMLElement;
  navigationObserver = new MutationObserver(async () => {
    const navigation = getRepositoryNavigation()[0];
    if (!navigation || syncingPerceptorTab) {
      return;
    }

    const perceptorTab = document.getElementById(featureId);
    if (!perceptorTab) {
      await syncPerceptorTab();
      return;
    }

    if (isPerceptor() && perceptorTab.getAttribute('aria-current') !== 'page') {
      await updatePerceptorTabHighlighting();
    }
  });

  navigationObserver.observe(repositoryNavigation, {
    childList: true,
    subtree: true,
  });
};

const init = async (): Promise<void> => {
  await syncPerceptorTab();
  await observeRepositoryNavigation();
  // TODO need a mechanism to remove extra listeners like this one
  // add event listener to update tab highlighting at each turbo:load event
  if (!highlightingListenerAttached) {
    highlightingListenerAttached = true;
    document.addEventListener('turbo:load', async () => {
      await syncPerceptorTab();
    });
  }
};

features.add(featureId, {
  asLongAs: [isGithub, isPublicRepo],
  awaitDomReady: false,
  init,
});
