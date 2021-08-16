import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { isPerceptor, runsWhen } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';
import { inject2Perceptor } from './Perceptor';

const PerceptorLayoutView: React.FC<{}> = () => {
  return (
    <div />
  )
}
@runsWhen([isPerceptor])
class PerceptorLayout extends PerceptorBase {
  public async run(): Promise<void> {
    // remove the original container
    const parentContainer = $('.container-xl.clearfix.new-discussion-timeline');
    $('#repo-content-pjax-container', parentContainer).remove();

    // create the new one : percepter container
    const percepterContainer = document.createElement('div');
    percepterContainer.setAttribute('id', 'perceptor-layout');

    render(
      <PerceptorLayoutView />,
      percepterContainer,
    );
    parentContainer.prepend(percepterContainer);
  }
}

inject2Perceptor(PerceptorLayout);