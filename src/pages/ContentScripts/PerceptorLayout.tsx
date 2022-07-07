import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { isPerceptor, runsWhen } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';

const PerceptorLayoutView: React.FC = () => {
  return <div />;
};
@runsWhen([isPerceptor])
class PerceptorLayout extends PerceptorBase {
  public async run(): Promise<void> {
    // remove the original container
    const parentContainer = $('div.clearfix.container-xl:first');
    parentContainer.children('div.Layout').remove();

    // create the new one : percepter container
    const percepterContainer = document.createElement('div');
    percepterContainer.setAttribute('id', 'perceptor-layout');

    render(<PerceptorLayoutView />, percepterContainer);
    parentContainer.append(percepterContainer);
  }
}

export default PerceptorLayout;
