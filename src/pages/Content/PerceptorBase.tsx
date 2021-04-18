import React from 'react';
import { render } from 'react-dom';
import ErrorMessageBar from '../../components/ExceptionPage/ErrorMessageBar';

export default abstract class PerceptorBase {
  public logger: any;

  constructor() {
    this.logger = {
      info: (message?: any, ...optionalParams: any[]): void => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('ℹ️ Perceptor : ', message, ...optionalParams);
        }
      },
      error: (message?: any, ...optionalParams: any[]): void => {
        console.error('❌ Error Message From Perceptor :', message, ...optionalParams);
        // TODO: pass error message to ErrorMessageBar component
        render(<ErrorMessageBar />, document.getElementById('perceptor'))
      }
    };
  }

  public abstract run(): Promise<void>;
}