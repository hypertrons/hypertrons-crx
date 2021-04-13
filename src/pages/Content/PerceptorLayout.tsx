import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { Stack } from 'office-ui-fabric-react';
import { isPerceptor } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';

const PerceptorLayoutView: React.FC<{}> = () => {
  return (
    <Stack horizontalAlign="center" />
  )
}

export default class PerceptorLayout extends PerceptorBase {
  constructor() {
    super();
    this.include = [
      isPerceptor
    ];
  }
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