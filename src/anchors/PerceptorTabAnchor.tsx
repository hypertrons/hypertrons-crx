import $ from 'jquery';
import { utils } from 'github-url-detection';
import { isPerceptor, runsWhen, isPublicRepo } from '../utils/utils';
import PerceptorBase from '../PerceptorBase';
import { render } from 'react-dom';
import React from 'react';
import TeachingBubbleWrapper from '../views/TeachingBubbleWrapperView/TeachingBubbleWrapperView';
import logger from '../utils/logger';

@runsWhen([isPublicRepo])
class PerceptorTabAnchor extends PerceptorBase {
  public async run(): Promise<void> {
    // avoid redundant clone
    let perceptorTab = $('#perceptor_tab');
    if (perceptorTab.length > 0) {
      logger.info('perceptor tab already exists');

      // Un-select one of the tabs if necessary
      const insightsTab = $('a[id$="insights-tab"]').parent();
      const insightsLink = $('a', insightsTab);
      const perceptorLink = $('a', perceptorTab);

      if (insightsLink.hasClass('selected')) {
        if (isPerceptor()) {
          insightsLink.removeClass('selected');
          insightsLink.removeAttr('aria-current');
          perceptorLink.addClass('selected');
          perceptorLink.attr('aria-current', 'page');
        } else {
          perceptorLink.removeClass('selected');
          perceptorLink.removeAttr('aria-current');
        }
      }
      return;
    }

    // copy Insights tab data item
    const insightsTabDataItem = $('li[data-menu-item$="insights-tab"]');
    const perceptorTabDataItem = insightsTabDataItem.clone(true);
    const perceptorTabDataItemLink = perceptorTabDataItem.children('a');
    let href = perceptorTabDataItemLink.attr('href');
    // @ts-ignore
    href = `${href}?redirect=perceptor`;
    perceptorTabDataItemLink.attr('href', href);
    perceptorTabDataItemLink.attr('data-selected-links', href);
    perceptorTabDataItemLink.text('Perceptor');
    perceptorTabDataItem.attr('data-menu-item', 'i99perceptor-tab');
    insightsTabDataItem.after(perceptorTabDataItem);

    // copy Insights tab
    const insightsTab = $('a[id$="insights-tab"]').parent();
    perceptorTab = insightsTab.clone(true);
    perceptorTab.attr('id', 'perceptor_tab');
    const perceptorTablink = perceptorTab.children('a');
    perceptorTablink.attr('data-tab-item', 'i99perceptor-tab');

    // Un-select one of the tabs if necessary
    const insightsLink = $('a', insightsTab);
    const perceptorLink = $('a', perceptorTab);
    perceptorLink
      .attr('id', 'percepter-tab')
      .attr(
        'data-selected-links',
        'hypertrons/hypertrons-crx/pulse?redirect=perceptor'
      ); // fix: perceptor-tab blinks when click insight-tab

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
    perceptorLink.attr(
      'href',
      `https://github.com/${
        utils.getRepositoryInfo(window.location)!.nameWithOwner
      }/pulse?redirect=perceptor`
    );

    $('span[data-content="Insights"]', perceptorLink).text('Perceptor');
    //Added the new perceptor Icon
    $('svg.octicon', perceptorLink).html(
      '<path xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" d="M 14.253906 0 C 13.292969 0 12.507812 0.78125 12.507812 1.746094 C 12.507812 2.046875 12.585938 2.328125 12.71875 2.578125 L 9.859375 5.4375 C 9.464844 5.128906 8.972656 4.945312 8.4375 4.945312 C 7.898438 4.945312 7.40625 5.128906 7.011719 5.4375 L 4.78125 3.207031 C 4.882812 3.03125 4.945312 2.832031 4.945312 2.617188 C 4.945312 1.976562 4.421875 1.453125 3.78125 1.453125 C 3.140625 1.453125 2.617188 1.976562 2.617188 2.617188 C 2.617188 3.261719 3.140625 3.78125 3.78125 3.78125 C 3.996094 3.78125 4.195312 3.71875 4.371094 3.617188 L 6.601562 5.847656 C 6.292969 6.242188 6.109375 6.734375 6.109375 7.273438 C 6.109375 7.808594 6.292969 8.304688 6.601562 8.699219 L 2.917969 12.382812 C 2.605469 12.101562 2.195312 11.925781 1.746094 11.925781 C 0.78125 11.925781 0 12.710938 0 13.671875 C 0 14.636719 0.78125 15.417969 1.746094 15.417969 C 2.707031 15.417969 3.492188 14.636719 3.492188 13.671875 C 3.492188 13.371094 3.414062 13.089844 3.28125 12.839844 L 7.011719 9.109375 C 7.332031 9.359375 7.722656 9.527344 8.144531 9.578125 L 8.144531 12.535156 C 7.320312 12.675781 6.691406 13.390625 6.691406 14.253906 C 6.691406 15.21875 7.472656 16 8.4375 16 C 9.398438 16 10.183594 15.21875 10.183594 14.253906 C 10.183594 13.390625 9.550781 12.675781 8.726562 12.535156 L 8.726562 9.578125 C 9.152344 9.527344 9.539062 9.359375 9.863281 9.109375 L 12.09375 11.339844 C 11.988281 11.511719 11.925781 11.710938 11.925781 11.925781 C 11.925781 12.570312 12.449219 13.089844 13.089844 13.089844 C 13.734375 13.089844 14.253906 12.570312 14.253906 11.925781 C 14.253906 11.285156 13.734375 10.761719 13.089844 10.761719 C 12.875 10.761719 12.675781 10.828125 12.503906 10.929688 L 10.273438 8.699219 C 10.578125 8.304688 10.761719 7.808594 10.761719 7.273438 C 10.761719 6.734375 10.578125 6.242188 10.273438 5.847656 L 13.085938 3.035156 C 13.394531 3.316406 13.804688 3.492188 14.253906 3.492188 C 15.21875 3.492188 16 2.707031 16 1.746094 C 16 0.78125 15.21875 0 14.253906 0 Z M 3.199219 2.617188 C 3.199219 2.296875 3.460938 2.035156 3.78125 2.035156 C 4.101562 2.035156 4.363281 2.296875 4.363281 2.617188 C 4.363281 2.9375 4.101562 3.199219 3.78125 3.199219 C 3.460938 3.199219 3.199219 2.9375 3.199219 2.617188 Z M 1.746094 14.835938 C 1.105469 14.835938 0.582031 14.316406 0.582031 13.671875 C 0.582031 13.03125 1.105469 12.507812 1.746094 12.507812 C 2.386719 12.507812 2.910156 13.03125 2.910156 13.671875 C 2.910156 14.316406 2.386719 14.835938 1.746094 14.835938 Z M 9.601562 14.253906 C 9.601562 14.894531 9.078125 15.417969 8.4375 15.417969 C 7.792969 15.417969 7.273438 14.894531 7.273438 14.253906 C 7.273438 13.613281 7.792969 13.089844 8.4375 13.089844 C 9.078125 13.089844 9.601562 13.613281 9.601562 14.253906 Z M 8.4375 9.019531 C 7.472656 9.019531 6.691406 8.234375 6.691406 7.273438 C 6.691406 6.308594 7.472656 5.527344 8.4375 5.527344 C 9.398438 5.527344 10.183594 6.308594 10.183594 7.273438 C 10.183594 8.234375 9.398438 9.019531 8.4375 9.019531 Z M 13.671875 11.925781 C 13.671875 12.25 13.410156 12.507812 13.089844 12.507812 C 12.769531 12.507812 12.507812 12.25 12.507812 11.925781 C 12.507812 11.605469 12.769531 11.34375 13.089844 11.34375 C 13.410156 11.34375 13.671875 11.605469 13.671875 11.925781 Z M 14.253906 2.910156 C 13.613281 2.910156 13.089844 2.386719 13.089844 1.746094 C 13.089844 1.105469 13.613281 0.582031 14.253906 0.582031 C 14.894531 0.582031 15.417969 1.105469 15.417969 1.746094 C 15.417969 2.386719 14.894531 2.910156 14.253906 2.910156 Z M 14.253906 2.910156 "/>'
    );

    render(<TeachingBubbleWrapper target="#perceptor_tab" />, teaching_bubble);
    insightsTab.after(perceptorTab);
  }
}

export default PerceptorTabAnchor;
