import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import { runsWhen } from '../utils/utils';
import PerceptorBase from '../PerceptorBase';
import logger from '../utils/logger';
import HypertronsView from '../views/HypertronsView/HypertronsView';

@runsWhen([pageDetect.isPR, pageDetect.isIssue])
class HypertronsAnchor extends PerceptorBase {
  public static hypertronsConfig: any;

  private static renderView(): void {
    // avoid redundant button
    if ($('#hypertrons_button').length > 0) {
      logger.info('hypertrons tab exists');
      return;
    }

    // add hypertrons tab
    const commentForm = $('.js-new-comment-form');
    const parentContainer = commentForm.find('.d-flex.flex-justify-end');
    const hypertronsTab = document.createElement('div');
    render(
      <HypertronsView hypertronsConfig={this.hypertronsConfig} />,
      hypertronsTab
    );
    parentContainer.prepend(hypertronsTab);
  }

  public async run(config: any): Promise<void> {
    HypertronsAnchor.hypertronsConfig = config;
    // @ts-ignore
    const observer = new MutationObserver(HypertronsAnchor.renderView);
    const element = document.querySelector('#new_comment_field');
    // @ts-ignore
    observer.observe(element, {
      attributes: true,
    });

    HypertronsAnchor.renderView();
  }
}

export default HypertronsAnchor;
