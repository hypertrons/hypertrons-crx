// import React from 'react';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import features from '.';
import { isPerceptor } from '../../../utils/utils';

const init = async (): Promise<void> => {
  const insightsTab = $('.js-repo-nav [data-ga-click="Repository, Navigation click, Insights tab"]').parent();

  // copy Insights tab
  const perceptorTab = insightsTab.clone(true);

  // Un-select one of the tabs if necessary
  const insightsLink = $('a', insightsTab);
  const perceptorLink = $('a', perceptorTab);

  if (insightsLink.hasClass('selected')) {
    if (isPerceptor()) {
      insightsLink.removeClass('selected');
      insightsLink.removeAttr('aria-current');
    } else {
      perceptorLink.removeClass('selected');
      perceptorLink.removeAttr('aria-current');
    }
  }

  // Update
  perceptorLink.attr("href", "https://github.com/hypertrons/hypertrons-crx/pulse?redirect=perceptor");
  $('span[data-content="Insights"]', perceptorLink).text('Perceptor');

  insightsTab.after(perceptorTab);
}

void features.add('perceptorTab', {
  include: [
		pageDetect.isRepo
	],
  init
});