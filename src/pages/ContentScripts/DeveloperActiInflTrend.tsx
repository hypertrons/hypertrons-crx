import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import { runsWhen, getMessageByLocale } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';
import { inject2Perceptor } from './Perceptor';
import Settings, { loadSettings } from '../../utils/settings';
import { utils } from 'github-url-detection';

interface DeveloperActiInflTrendViewProps {
  currentDeveloper: string;
}

const DeveloperActiInflTrendView: React.FC<DeveloperActiInflTrendViewProps> = ({
  currentDeveloper,
}) => {
  return (
    <div className="border-top color-border-secondary pt-3 mt-3">
      <h2 className="h4 mb-3">Activity & Influence Trends</h2>
      <p>This is content.</p>
      <p>This is content.</p>
      <p>This is content.</p>
      <p>This is content.</p>
      <p>This is content.</p>
    </div>
  );
};

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
    const settings = await loadSettings();
    render(
      <DeveloperActiInflTrendView currentDeveloper={this._currentDeveloper}/>,
      newContainer
    );
    profileArea.after(newContainer);
  }
}

inject2Perceptor(DeveloperActiInflTrend);
