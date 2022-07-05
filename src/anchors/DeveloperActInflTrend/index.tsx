import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import PerceptorBase from '../PerceptorBase';
import { runsWhen } from '../../utils/utils';
import DeveloperActiInflTrendView from '../../views/DeveloperActiInflTrend';

@runsWhen([pageDetect.isUserProfile])
class DeveloperActiInflTrend extends PerceptorBase {
  private _currentDeveloper: string;

  constructor() {
    super();
    this._currentDeveloper = '';
  }

  public async run(): Promise<void> {
    const profileArea = $('.js-profile-editable-area').parent();
    const newContainer = document.createElement('div');
    newContainer.id = 'developer-acti-infl-trend';
    newContainer.style.width = '100%';
    this._currentDeveloper = $('.p-nickname.vcard-username.d-block')
      .text()
      .trim();

    render(
      <DeveloperActiInflTrendView currentDeveloper={this._currentDeveloper} />,
      newContainer
    );
    profileArea.after(newContainer);
  }
}

export default DeveloperActiInflTrend;
