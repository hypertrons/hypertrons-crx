import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { utils } from 'github-url-detection';

import PerceptorBase from '../PerceptorBase';
import { runsWhen, isPublicRepo } from '../utils/utils';
import DocsGPTChatWidget from '../views/DocsGPTChatWidget';

@runsWhen([isPublicRepo])
class DocsGPTChatWidgetAnchor extends PerceptorBase {
  private _currentRepo: string;

  constructor() {
    super();
    this._currentRepo = '';
  }

  public async run(): Promise<void> {
    const repoName = utils.getRepositoryInfo(window.location)!.nameWithOwner;

    if ($('#docs-gpt-chat-widget').length !== 0) {
      if (this._currentRepo !== repoName) {
        $('#docs-gpt-chat-widget').remove();
      } else {
        return;
      }
    }

    this._currentRepo = repoName;

    const container = document.createElement('div');
    container.id = 'docs-gpt-chat-widget';
    render(<DocsGPTChatWidget currentRepo={this._currentRepo} />, container);
    $('body').append(container);
  }
}

export default DocsGPTChatWidgetAnchor;
