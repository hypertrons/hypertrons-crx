import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import PerceptorBase from '../PerceptorBase';
import { runsWhen } from '../utils/utils';
import { utils } from 'github-url-detection';
import RepoActORlTrendView from '../views/RepoActORTrendView/RepoActORTrendView';

@runsWhen([pageDetect.isRepoHome])
class RepoActORTrendAnchor extends PerceptorBase {
  private _currentRepo: string;

  constructor() {
    super();
    this._currentRepo = '';
  }

  public async run(): Promise<void> {
    this._currentRepo = utils.getRepositoryInfo(window.location)!.nameWithOwner;

    let newBorderGridRow = null;
    let newBorderGridCell = null;

    // if not the first time to enter this code
    if (document.getElementById('repo-act-OR-trend') != null) {
      newBorderGridCell =
        $('#repo-act-OR-trend').children('.BorderGrid-cell')[0];

      render(
        <RepoActORlTrendView currentRepo={this._currentRepo} />,
        newBorderGridCell
      );
    } else {
      newBorderGridRow = document.createElement('div');
      newBorderGridRow.id = 'repo-act-OR-trend';
      newBorderGridRow.className = 'BorderGrid-row';
      newBorderGridCell = document.createElement('div');
      newBorderGridCell.className = 'BorderGrid-cell';
      newBorderGridRow.appendChild(newBorderGridCell);

      render(
        <RepoActORlTrendView currentRepo={this._currentRepo} />,
        newBorderGridCell
      );

      const borderGridRows = $('div.Layout-sidebar').children('.BorderGrid');
      borderGridRows.append(newBorderGridRow);
    }
  }
}

export default RepoActORTrendAnchor;
