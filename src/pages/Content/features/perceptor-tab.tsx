// import React from 'react';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import features from '.';
import { isPerceptor } from '../common/PageDetect';


const init = async (): Promise<void> => {
  const settingsTab = $('.js-repo-nav [data-ga-click="Repository, Navigation click, Settings tab"]').parent();

  // copy Settings tab
  const perceptorTab = settingsTab.clone(true);

  // Un-select one of the tabs if necessary
  const settingsLink = $('a', settingsTab);
  const perceptorLink = $('a', perceptorTab);

  if (settingsLink.hasClass('selected')) {
    if (isPerceptor()) {
      settingsLink.removeClass('selected');
      settingsLink.removeAttr('aria-current');
    } else {
      perceptorLink.removeClass('selected');
      perceptorLink.removeAttr('aria-current');
    }
  }

  // Update
  perceptorLink.attr("href", "https://github.com/hypertrons/hypertrons-crx/settings?redirect=perceptor");
  $('span[data-content="Settings"]', perceptorLink).text('Perceptor');

  settingsTab.after(perceptorTab);
}

void features.add('perceptor-tab', {
  include: [
		pageDetect.isRepo
	],
  init
});