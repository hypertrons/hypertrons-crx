import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { utils } from 'github-url-detection';
import { isPublicRepo, runsWhen } from '../utils/utils';
import PerceptorBase from '../PerceptorBase';
import HorizontalBannerView from '../views/HorizontalBannerView/HorizontalBannerView';
@runsWhen([isPublicRepo])
class HorizontalBannerAnchor extends PerceptorBase {
  private _currentRepo: string;

  constructor() {
    super();
    this._currentRepo = '';
  }

  public async run(): Promise<void> {
    this._currentRepo = utils.getRepositoryInfo(window.location)!.nameWithOwner;

    let newBorderHoriRow = null;
    let newBorderHoriCell = null;

    // if not the first time to enter this code
    if (document.getElementById('hori-banner-trend') != null) {
      newBorderHoriCell =
        $('#hori-banner-trend').children('.BorderHori-cell')[0];

      render(
        <HorizontalBannerView currentRepo={this._currentRepo} />,
        newBorderHoriCell
      );
    } else {
      newBorderHoriRow = document.createElement('div');
      newBorderHoriRow.id = 'hori-banner-trend';
      newBorderHoriRow.className = 'BorderHori-row';
      newBorderHoriRow.style.width = '100%';
      newBorderHoriCell = document.createElement('div');
      newBorderHoriCell.className = 'BorderHori-cell';
      newBorderHoriRow.appendChild(newBorderHoriCell);

      render(
        <HorizontalBannerView currentRepo={this._currentRepo} />,
        newBorderHoriCell
      );
      const borderHoriRows = $('div.pt-3');
      borderHoriRows.append(newBorderHoriRow);
    }
  }
}
export default HorizontalBannerAnchor;
