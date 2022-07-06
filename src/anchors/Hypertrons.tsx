import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import { runsWhen } from '../utils/utils';
import PerceptorBase from '../pages/ContentScripts/PerceptorBase';
import { inject2Perceptor } from '../pages/ContentScripts/Perceptor';
import logger from '../utils/logger';
import HypertronsTabView from '../views/Hypertrons';

@runsWhen([pageDetect.isPR, pageDetect.isIssue])
class Hypertrons extends PerceptorBase {
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
      <HypertronsTabView hypertronsConfig={this.hypertronsConfig} />,
      hypertronsTab
    );
    parentContainer.prepend(hypertronsTab);
  }

  public async run(config: any): Promise<void> {
    Hypertrons.hypertronsConfig = config;
    // @ts-ignore
    const observer = new MutationObserver(Hypertrons.renderView);
    const element = document.querySelector('#new_comment_field');
    // @ts-ignore
    observer.observe(element, {
      attributes: true,
    });

    Hypertrons.renderView();
  }
}

export default Hypertrons;
