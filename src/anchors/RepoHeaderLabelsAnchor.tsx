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
    // Ideally, we should do nothing if the container already exists. But
    // when I try to navigate back from profile page, I find tooltip won't
    // show though the related element exists. I think there might be something
    // else in javascript context, which is broken after navigation between
    // pages. So instead of doing nothing, I remove the container and reload
    // it again. At least this way works.
    if ($('#repo-header-labels').length > 0) {
      $('#repo-header-labels').remove();
    }

    this._currentRepo = utils.getRepositoryInfo(window.location)!.nameWithOwner;

    const container = document.createElement('div');
    container.id = 'repo-header-labels';

    render(<RepoHeaderLabelsView currentRepo={this._currentRepo} />, container);

    $('#repository-container-header')
      .find('span.Label.Label--secondary')
      .after(container);
  }
}

export default RepoHeaderLabelsAnchor;
