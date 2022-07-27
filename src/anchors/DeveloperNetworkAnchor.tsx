import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import { runsWhen } from '../utils/utils';
import { loadSettings } from '../utils/settings';
import PerceptorBase from '../PerceptorBase';
import DeveloperNetworkView from '../views/DeveloperNetworkView/DeveloperNetworkView';

@runsWhen([pageDetect.isUserProfile])
class DeveloperNetworkAnchor extends PerceptorBase {
  private _currentDeveloper: string;

  constructor() {
    super();
    this._currentDeveloper = '';
  }

  public async run(): Promise<void> {
    const profileArea = $('.js-profile-editable-area').parent();
    const DeveloperNetworkDiv = document.createElement('div');
    DeveloperNetworkDiv.id = 'developer-network';
    DeveloperNetworkDiv.style.width = '100%';
    this._currentDeveloper = $('.p-nickname.vcard-username.d-block')
      .text()
      .trim();
    const settings = await loadSettings();
    render(
      <DeveloperNetworkView
        currentDeveloper={this._currentDeveloper}
        graphType={settings.graphType}
      />,
      DeveloperNetworkDiv
    );
    profileArea.after(DeveloperNetworkDiv);
  }
}

export default DeveloperNetworkAnchor;
