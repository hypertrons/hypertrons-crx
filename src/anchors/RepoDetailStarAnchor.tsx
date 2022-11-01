import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import PerceptorBase from '../PerceptorBase';
import { runsWhen, isPublicRepo, getGithubTheme } from '../utils/utils';
import { utils } from 'github-url-detection';
import RepoDetailStarView from '../views/RepoDetailStarView/RepoDetailStarView';

const githubTheme = getGithubTheme();

@runsWhen([isPublicRepo])
class RepoDetailStarAnchor extends PerceptorBase {
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
    if ($('#star-tooltip-container').length > 0) {
      $('#star-tooltip-container').remove();
    }

    this._currentRepo = utils.getRepositoryInfo(window.location)!.nameWithOwner;

    const attributes = {
      'data-tip': '',
      'data-for': 'star-tooltip',
      'data-class': `floating-window ${githubTheme}`,
      'data-place': 'left',
      'data-effect': 'solid',
      'data-delay-hide': 500,
      'data-delay-show': 500,
      style: { color: githubTheme === 'light' ? '#24292f' : '#c9d1d9' },
      'data-text-color': githubTheme === 'light' ? '#24292F' : '#C9D1D9',
      'data-background-color': githubTheme === 'light' ? 'white' : '#0D1117',
    };
    // The data-ga-click attribute differs after starring, so there are 2 cases
    $('button[data-ga-click*="click star button"]').attr(attributes);
    $('button[data-ga-click*="click unstar button"]').attr(attributes);

    const tooltipContainer = document.createElement('div');
    tooltipContainer.id = 'star-tooltip-container';
    $('#repository-container-header').append(tooltipContainer);
    render(
      <RepoDetailStarView currentRepo={this._currentRepo} />,
      tooltipContainer
    );
  }
}

export default RepoDetailStarAnchor;
