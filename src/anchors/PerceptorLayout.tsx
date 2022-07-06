import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { isPerceptor, runsWhen } from '../utils/utils';
import PerceptorBase from '../pages/ContentScripts/PerceptorBase';
import { inject2Perceptor } from '../pages/ContentScripts/Perceptor';

const PerceptorLayoutView: React.FC = () => {
  return <div />;
};
@runsWhen([isPerceptor])
class PerceptorLayout extends PerceptorBase {
  public async run(): Promise<void> {
    // remove the original container
    const parentContainer = $('#repo-content-pjax-container').children(
      'div.clearfix.container-xl'
    );
    parentContainer.children('div.Layout').remove();

    // create the new one : percepter container
    const percepterContainer = document.createElement('div');
    percepterContainer.setAttribute('id', 'perceptor-layout');

    render(<PerceptorLayoutView />, percepterContainer);
    parentContainer.append(percepterContainer);
  }
}

export default PerceptorLayout;
