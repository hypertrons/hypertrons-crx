import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import elementReady from 'element-ready';
import * as pageDetect from 'github-url-detection';
import { chromeGet } from '../../../utils/utils'
import ErrorMessageBar from '../../../components/ExceptionPage/ErrorMessageBar'

const log = (name: string, message: Error | string | unknown, ...extras: unknown[]): void => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(
      `✅ Hypertrons-crx → ${name} →`,
      message,
      ...extras
    );
  }
}

const logError = (name: string, error: Error | string | unknown, ...extras: unknown[]): void => {
  console.error(
    `❌ Hypertrons-crx → ${name} →`,
    error,
    ...extras
  );
  render(<ErrorMessageBar />, document.getElementById('htpertrons-crx'))
}

const globalReady = async (): Promise<void> => {

  await elementReady('body', { waitForChildren: false });

  if (pageDetect.is404() || pageDetect.is500()) {
    return;
  }
}
const defaultComponent = ['hypertrons-crx', 'perceptorTab', 'perceptorLayout'];
const add = async (name: string, loader: any): Promise<void> => {
  await globalReady();
  const settings = await chromeGet("settings");
  if (!defaultComponent.includes(name) && (settings && !settings[name])) {
    return;
  }
  const {
    include = [() => true], // Default: every page
    init
  } = loader;
  // If every `include` is false, don’t run the feature
  if (include.every((c: () => any) => !c())) {
    return;
  }
  try {
    await init();
    log(name, 'loaded.');
  } catch (error: unknown) {
    logError(name, error)
  }
}

void add('hypertrons-crx', {
  init: async () => {
    const hypertronsCrxDiv = document.createElement('div');
    hypertronsCrxDiv.id = 'htpertrons-crx';
    $('#js-repo-pjax-container').prepend(hypertronsCrxDiv);
  }
})
const features = {
  add,
  error: logError
};
export default features;