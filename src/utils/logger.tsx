import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import ErrorMessageBar from '../components/ExceptionPage/ErrorMessageBar';
import { elementExists } from './utils';

const logger = {
  info: (message?: any, ...optionalParams: any[]): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('ℹ️ Hypertrons-crx : ', message, ...optionalParams);
    }
  },
  error: (code?: number, message?: any, ...optionalParams: any[]): void => {
    console.error(
      '❌ Error From Hypertrons-crx. Code: ',
      code,
      ' Message: ',
      message,
      ...optionalParams
    );
    if (elementExists($('#hypertrons-crx-error-message'))) {
      return;
    }
    const root = $('body');

    // create div
    const errorContainer = document.createElement('div');
    errorContainer.setAttribute('id', 'hypertrons-crx-error-message');

    render(<ErrorMessageBar />, errorContainer);
    root.prepend(errorContainer);
  },
};

export default logger;
