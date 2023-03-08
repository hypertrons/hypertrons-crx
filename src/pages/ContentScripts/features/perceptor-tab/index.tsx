import $ from 'jquery';
import elementReady from 'element-ready';
import { isPerceptor, isPublicRepo } from '../../../../utils/utils';
import iconSvgPath from './icon-svg-path';
import features from '../../../../feature-manager';
import sleep from '../../../../helpers/sleep';

const featureId = features.getFeatureID(import.meta.url);

const addPerceptorTab = async (): Promise<void | false> => {
  // add to tab bar
  const insightsTab = await elementReady(
    'a.UnderlineNav-item[id="insights-tab"]',
    { waitForChildren: false }
  );
  if (!insightsTab) {
    // Insights are disabled
    return false;
  }
  const perceptorTab = insightsTab.cloneNode(true) as HTMLAnchorElement;
  delete perceptorTab.dataset.selectedLinks;
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

  if (!insightsTab.parentElement) {
    return false;
  }
  const tabContainer = document.createElement('li');
  tabContainer.appendChild(perceptorTab);
  tabContainer.setAttribute('data-view-component', 'true');
  tabContainer.className = 'd-inline-flex';
  insightsTab.parentElement.after(tabContainer);

  // add to drop down menu
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
  await sleep(10);
  if (!insightsTabSeletedLinks) return;
  insightsTab.attr('data-selected-links', insightsTabSeletedLinks);
  perceptorTab.removeAttr('data-selected-links');
  return;
};

const init = async (): Promise<void> => {
  await addPerceptorTab();
  await updatePerceptorTabHighlighting();
  // add event listener to update tab highlighting at each turbo:load event
  document.addEventListener('turbo:load', async () => {
    await updatePerceptorTabHighlighting();
  });
};

features.add(featureId, {
  asLongAs: [isPublicRepo],
  awaitDomReady: false,
  init,
});
