import $ from 'jquery';
import elementReady from 'element-ready';

import iconSvgPath from './icon-svg-path';
import features from '../../../../feature-manager';
import isPerceptor from '../../../../helpers/is-perceptor';
import { isPublicRepoWithMeta } from '../../../../helpers/get-repo-info';
import sleep from '../../../../helpers/sleep';

const featureId = features.getFeatureID(import.meta.url);

const addPerceptorTab = async (): Promise<void | false> => {
  // the creation of the Perceptor tab is based on the Insights tab
  const insightsTab = await elementReady(
    'a.UnderlineNav-item[id="insights-tab"]',
    { waitForChildren: false }
  );
  if (!insightsTab) {
    // if the selector failed to find the Insights tab
    return false;
  }
  const perceptorTab = insightsTab.cloneNode(true) as HTMLAnchorElement;
  delete perceptorTab.dataset.selectedLinks;
  perceptorTab.removeAttribute('aria-current');
  perceptorTab.classList.remove('selected');
  const perceptorHref = `${insightsTab.href}?redirect=perceptor`;
  perceptorTab.href = perceptorHref;
  perceptorTab.id = featureId;
  perceptorTab.setAttribute('data-tab-item', featureId);

  const perceptorTitle = $('[data-content]', perceptorTab);
  perceptorTitle.text('Perceptor').attr('data-content', 'Perceptor');

  // slot for any future counter function
  const perceptorCounter = $('[class=Counter]', perceptorTab);
  perceptorCounter.attr('id', `${featureId}-count`);

  // replace with the perceptor Icon
  $('svg.octicon', perceptorTab).html(iconSvgPath);

  // add the Perceptor tab to the tabs list
  if (!insightsTab.parentElement) {
    return false;
  }
  const tabContainer = document.createElement('li');
  tabContainer.appendChild(perceptorTab);
  tabContainer.setAttribute('data-view-component', 'true');
  tabContainer.className = 'd-inline-flex';
  insightsTab.parentElement.after(tabContainer);

  // add to drop down menu (when the window is narrow enough some tabs are hidden into "···" menu)
  const repoNavigationDropdown = await elementReady('.UnderlineNav-actions ul');
  if (!repoNavigationDropdown) {
    return false;
  }
  const insightsTabDataItem = $(
    'li[data-menu-item$="insights-tab"]',
    repoNavigationDropdown
  );
  const perceptorTabDataItem = insightsTabDataItem.clone(true);
  perceptorTabDataItem.attr('data-menu-item', featureId);
  perceptorTabDataItem.children('a').text('Perceptor').attr({
    'data-selected-links': perceptorHref,
    href: perceptorHref,
  });
  insightsTabDataItem.after(perceptorTabDataItem);

  // Trigger a reflow to push the right-most tab into the overflow dropdown
  window.dispatchEvent(new Event('resize'));
};

const updatePerceptorTabHighlighting = async (): Promise<void> => {
  const insightsTab = $('#insights-tab');
  const perceptorTab = $(`#${featureId}`);
  // no operation needed
  if (!isPerceptor()) return;
  // if perceptor tab
  const insightsTabSeletedLinks = insightsTab.attr('data-selected-links');
  insightsTab.removeAttr('data-selected-links');
  perceptorTab.attr('data-selected-links', 'pulse');
  // should wait a short time for the host code to update the tab highlighting first
  await sleep(10);
  if (!insightsTabSeletedLinks) return;
  insightsTab.attr('data-selected-links', insightsTabSeletedLinks);
  perceptorTab.removeAttr('data-selected-links');
};

const init = async (): Promise<void> => {
  await addPerceptorTab();
  // TODO need a mechanism to remove extra listeners like this one
  // add event listener to update tab highlighting at each turbo:load event
  document.addEventListener('turbo:load', async () => {
    await updatePerceptorTabHighlighting();
  });
};

features.add(featureId, {
  asLongAs: [isPublicRepoWithMeta],
  awaitDomReady: false,
  init,
});
