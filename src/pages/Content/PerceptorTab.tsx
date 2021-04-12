// import React from 'react';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import { utils } from 'github-url-detection';
import { isPerceptor } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';

export default class PerceptorTab extends PerceptorBase {
  constructor() {
    super();
    this.include = [
      pageDetect.isRepo
    ];
  }
  public async run(): Promise<void> {
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
    perceptorLink.attr("href", `https://github.com/${utils.getRepositoryInfo(window.location)!.nameWithOwner}/pulse?redirect=perceptor`);
    $('span[data-content="Insights"]', perceptorLink).text('Perceptor');

    insightsTab.after(perceptorTab);
  }
}