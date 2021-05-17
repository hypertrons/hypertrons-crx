import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import { utils } from 'github-url-detection';
import { isPerceptor, runsWhen } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';
import { inject2Perceptor } from './Perceptor';
import { render } from 'react-dom';
import React from 'react';
import TeachingBubbleWrapper from './TeachingBubbleWrapper'

@runsWhen([pageDetect.isRepo])
class PerceptorTab extends PerceptorBase {

  public async run(): Promise<void> {
    const insightsTab = $('.js-repo-nav [data-ga-click="Repository, Navigation click, Insights tab"]').parent();

    // copy Insights tab
    const perceptorTab = insightsTab.clone(true);
    perceptorTab.attr('id','perceptor_tab');

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

    // Deal with teaching bubble
    const teaching_bubble = document.createElement('div');
    $('.js-repo-pjax-container').prepend(teaching_bubble);

    // Update
    perceptorLink.attr("href", `https://github.com/${utils.getRepositoryInfo(window.location)!.nameWithOwner}/pulse?redirect=perceptor`);
    $('span[data-content="Insights"]', perceptorLink).text('Perceptor');


    render(
      <TeachingBubbleWrapper target="#perceptor_tab"/>
      ,
      teaching_bubble
    );
    insightsTab.after(perceptorTab);
  }
}

inject2Perceptor(PerceptorTab);