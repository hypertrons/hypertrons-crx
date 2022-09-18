import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { utils } from 'github-url-detection';
import { isPerceptor, runsWhen } from '../utils/utils';
import PerceptorBase from '../PerceptorBase';
import { loadSettings } from '../utils/settings';
import DynamicRacingBarView from '../views/DynamicRacingBarView/DynamicRacingBarView';
@runsWhen([isPerceptor])
class DynamicRacingBarAnchor extends PerceptorBase {
  private _currentRepo: string;

  constructor() {
    super();
    this._currentRepo = '';
  }
  public async run(): Promise<void> {
    const perceptorContainer = $('#perceptor-layout').children();
    const newDivElement = document.createElement('div');
    newDivElement.id = 'contributors-activity-evolution';
    newDivElement.style.width = '100%';
    this._currentRepo = utils.getRepositoryInfo(window.location)!.nameWithOwner;
    const settings = await loadSettings();
    render(
      <DynamicRacingBarView
        currentRepo={this._currentRepo}
        graphType={settings.graphType}
      />,
      newDivElement
    );
    perceptorContainer.prepend(newDivElement);
  }
}
export default DynamicRacingBarAnchor;
