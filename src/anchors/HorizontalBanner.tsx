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
    if (document.getElementById('horizontal-banner')) {
      return;
    }

    const container = document.createElement('div');
    container.id = 'horizontal-banner';
    $('nav.js-repo-nav').after(container);
    render(<HorizontalBannerView currentRepo={this._currentRepo} />, container);
  }
}
export default HorizontalBannerAnchor;
