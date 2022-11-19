import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import PerceptorBase from '../PerceptorBase';
import { runsWhen } from '../utils/utils';
import DeveloperActORTrendView from '../views/DeveloperActORTrendView/DeveloperActORTrendView';

@runsWhen([pageDetect.isUserProfile])
class DeveloperActORTrendAnchor extends PerceptorBase {
  private _currentDeveloper: string;

  constructor() {
    super();
    this._currentDeveloper = '';
  }

  public async run(): Promise<void> {
    this._currentDeveloper = $('.p-nickname.vcard-username.d-block')
      .text()
      .trim();
    const container = document.getElementById('developer-act-OR-trend');
    if (container != null) {
      render(
        <DeveloperActORTrendView currentDeveloper={this._currentDeveloper} />,
        container
      );
    } else {
      const profileArea = $('.js-profile-editable-area').parent();
      const newContainer = document.createElement('div');
      newContainer.id = 'developer-act-OR-trend';
      newContainer.style.width = '100%';

      render(
        <DeveloperActORTrendView currentDeveloper={this._currentDeveloper} />,
        newContainer
      );
      profileArea.after(newContainer);
    }
  }
}

export default DeveloperActORTrendAnchor;
