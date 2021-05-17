import React, { useState } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import { Image, Link, Modal } from 'office-ui-fabric-react';
import ProjectBase from './ProjectBase';
import { getDeveloperCollabration, getParticipatedProjects } from '../../api/developer';
import { runsWhen, getMessageI18n } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';
import { inject2Perceptor } from './Perceptor';
import { loadSettings } from '../../utils/settings';

@runsWhen([pageDetect.isUserProfileMainTab])
class DeveloperNetwork extends PerceptorBase {
  private _currentDeveloper: string;
  private _developerCollabrationData: NetworkData;
  private _participatedProjectsData: NetworkData;

  constructor() {
    super();
    this._currentDeveloper = '';
    this._developerCollabrationData = {
      nodes: [],
      edges: [],
    };
    this._participatedProjectsData = {
      nodes: [],
      edges: [],
    };
  }

  public async run(): Promise<void> {
    const profileArea=$('.js-profile-editable-area').parent();
    const DeveloperNetworkDiv = document.createElement('div');
    DeveloperNetworkDiv.id = 'developer-network';
    DeveloperNetworkDiv.style.width = "100%";
    this._currentDeveloper = $('.p-nickname.vcard-username.d-block').text().trim();
    const settings = await loadSettings();
    try {
      this._developerCollabrationData = (await getDeveloperCollabration(this._currentDeveloper)).data;
      this._participatedProjectsData = (await await getParticipatedProjects(this._currentDeveloper)).data;

      render(
        <ProjectBase
          graphType={settings.graphType}
          developerCollabrationData={this._developerCollabrationData}
          participatedProjectsData={this._participatedProjectsData}
        />
        ,
        DeveloperNetworkDiv,
      );
      profileArea.after(DeveloperNetworkDiv);
    } catch (error) {
      this.logger.error('DeveloperNetwork', error);
      return;
    }
  }
}

inject2Perceptor(DeveloperNetwork);