import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import PerceptorBase from '../PerceptorBase';
import { runsWhen, isPublicRepo } from '../utils/utils';
import { utils } from 'github-url-detection';
import RepoDetailForkView from '../views/RepoDetailForkView/RepoDetailForkView';

@runsWhen([isPublicRepo])
class RepoDetailForkAnchor extends PerceptorBase {
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
    if ($('#fork-tooltip-container').length > 0) {
      $('#fork-tooltip-container').remove();
    }

    this._currentRepo = utils.getRepositoryInfo(window.location)!.nameWithOwner;

    $('a[data-ga-click*="show fork modal"]').attr({
      'data-tip': '',
      'data-for': 'fork-tooltip',
      'data-place': 'bottom',
      'data-type': 'dark',
      'data-effect': 'solid',
      'data-delay-hide': 500,
      'data-delay-show': 500,
    });

    const tooltipContainer = document.createElement('div');
    tooltipContainer.id = 'fork-tooltip-container';
    $('#repository-container-header').append(tooltipContainer);
    render(
      <RepoDetailForkView currentRepo={this._currentRepo} />,
      tooltipContainer
    );
  }
}

export default RepoDetailForkAnchor;
