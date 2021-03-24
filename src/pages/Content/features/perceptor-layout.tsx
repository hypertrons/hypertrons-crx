import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import features from '.';
import PerceptorLayout from '../../../components/PerceptorLayout';
import { isPerceptor } from '../../../utils/utils';

const init = async (): Promise<void | false> => {
  // remove the original container
  const parentContainer = $('.container-xl.clearfix.new-discussion-timeline');
  $('#repo-content-pjax-container', parentContainer).remove();

  // create the new one : percepter container
  const percepterContainer = document.createElement('div');
  percepterContainer.setAttribute('id', 'perceptor-layout');

  render(
    <PerceptorLayout />,
    percepterContainer,
  );
  parentContainer.prepend(percepterContainer);
}

void features.add('perceptor-layout', {
  include: [
    isPerceptor
  ],
  init
});