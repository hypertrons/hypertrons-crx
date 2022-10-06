import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import PerceptorBase from '../PerceptorBase';
import { runsWhen, isPublicRepo } from '../utils/utils';
import { utils } from 'github-url-detection';
import RepoHeaderLabelsView from '../views/RepoHeaderLabelsView/RepoHeaderLabelsView';

@runsWhen([isPublicRepo])
class RepoHeaderLabelsAnchor extends PerceptorBase {
  private _currentRepo: string;

  constructor() {
    super();
    this._currentRepo = '';
  }

  public async run(): Promise<void> {
    this._currentRepo = utils.getRepositoryInfo(window.location)!.nameWithOwner;

    let container = null;

    // if not the first time to enter this code
    if (document.getElementById('repo-header-labels') == null) {
      container = document.createElement('div');
      container.id = 'repo-header-labels';

      render(
        <RepoHeaderLabelsView currentRepo={this._currentRepo} />,
        container
      );

      $('#repository-container-header')
        .find('span.Label.Label--secondary')
        .after(container);
    }
  }
}

export default RepoHeaderLabelsAnchor;
