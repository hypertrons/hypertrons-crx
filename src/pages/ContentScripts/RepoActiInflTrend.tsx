import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import { runsWhen, getMessageByLocale } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';
import { inject2Perceptor } from './Perceptor';
import Settings, { loadSettings } from '../../utils/settings';
import { utils } from 'github-url-detection';

interface RepoActiInflTrendViewProps {
  currentRepo: string;
}

const RepoActiInflTrendView: React.FC<RepoActiInflTrendViewProps> = ({
  currentRepo,
}) => {
  return (
    <div>
      <h2 className="h4 mb-3">Activity & Influence Trends</h2>
      <p>This is content.</p>
      <p>This is content.</p>
      <p>This is content.</p>
      <p>This is content.</p>
      <p>This is content.</p>
    </div>
  );
};

@runsWhen([pageDetect.isRepo])
class RepoActiInflTrend extends PerceptorBase {
  private _currentRepo: string;

  constructor() {
    super();
    this._currentRepo = '';
  }
  public async run(): Promise<void> {
    if (document.getElementById('repo-acti-infl-trend') != null) return;

    this._currentRepo = utils.getRepositoryInfo(window.location)!.nameWithOwner;
    const settings = await loadSettings();

    const newBorderGridRow = document.createElement('div');
    newBorderGridRow.id = 'repo-acti-infl-trend';
    newBorderGridRow.className = 'BorderGrid-row';
    const newBorderGridCell = document.createElement('div');
    newBorderGridCell.className = 'BorderGrid-cell';
    newBorderGridRow.appendChild(newBorderGridCell);

    render(
      <RepoActiInflTrendView currentRepo={this._currentRepo} />,
      newBorderGridCell
    );

    const borderGridRows = $('div.Layout-sidebar').children('.BorderGrid');
    borderGridRows.append(newBorderGridRow);
  }
}

inject2Perceptor(RepoActiInflTrend);
