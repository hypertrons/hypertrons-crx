import $ from 'jquery';
import elementReady from 'element-ready';

import iconSvgPath from './icon-svg-path';
import features from '../../../../feature-manager';
import isPerceptor from '../../../../helpers/is-perceptor';
import { isPublicRepo } from '../../../../helpers/get-github-repo-info';
import sleep from '../../../../helpers/sleep';
import isGithub from '../../../../helpers/is-github';

const featureId = features.getFeatureID(import.meta.url);

const addPerceptorTab = async (): Promise<void | false> => {
  // the creation of the Perceptor tab is based on the Insights tab
  const insightsTab = await elementReady('a.UnderlineNav-item[id="insights-tab"]', { waitForChildren: false });
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
  perceptorTab.setAttribute(
    'data-analytics-event',
    `{"category":"Underline navbar","action":"Click tab","label":"Perceptor","target":"UNDERLINE_NAV.TAB"}`
  );
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
  const insightsTabDataItem = $('li[data-menu-item$="insights-tab"]', repoNavigationDropdown);
  const perceptorTabDataItem = insightsTabDataItem.clone(true);
  perceptorTabDataItem.attr('data-menu-item', featureId);
  perceptorTabDataItem.children('a').attr({
    href: perceptorHref,
  });
  const perceptorSvgElement = perceptorTabDataItem
    .children('a')
    .find('span.ActionListItem-visual.ActionListItem-visual--leading')
    .find('svg');
  perceptorSvgElement.attr('class', 'octicon octicon-perceptor');
  perceptorSvgElement.html(iconSvgPath);
  const perceptorTextElement = perceptorTabDataItem.children('a').find('span.ActionListItem-label');
  perceptorTextElement.text('Perceptor');
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
  if (insightsTab.hasClass('selected')) {
    insightsTab.removeClass('selected');
    insightsTab.removeAttr('aria-current');
    perceptorTab.attr('aria-current', 'page');
    perceptorTab.addClass('selected');
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

const init = async (): Promise<void> => {
  await addPerceptorTab();
  // TODO need a mechanism to remove extra listeners like this one
  // add event listener to update tab highlighting at each turbo:load event
  document.addEventListener('turbo:load', async () => {
    await updatePerceptorTabHighlighting();
  });
};

features.add(featureId, {
  asLongAs: [isGithub, isPublicRepo],
  awaitDomReady: false,
  init,
});
