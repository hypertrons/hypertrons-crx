import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import $ from 'jquery';
import { utils } from 'github-url-detection';

import PerceptorBase from '../PerceptorBase';
import { runsWhen, isPublicRepo, getGithubTheme } from '../utils/utils';
import DocsGPTChatWidget from '../views/DocsGPTChatWidget';

const DOCS_META_DATA_URL =
  'https://oss.x-lab.info/hypercrx/docsgpt_active_docs.json';

interface DocsMetaItem {
  type: 'repo' | 'org';
  name: string; // GitHub repo name or org name
  key: string; // corresponding docs name
}

@runsWhen([isPublicRepo])
class DocsGPTChatWidgetAnchor extends PerceptorBase {
  private _currentRepo: string;
  private _docsMetaData: DocsMetaItem[];

  constructor() {
    super();
    this._currentRepo = '';
    this._docsMetaData = [];
  }

  private async _getDocsMetaData() {
    const response = await fetch(DOCS_META_DATA_URL);
    if (response.ok) {
      this._docsMetaData = await response.json();
    } else {
      throw new Error('Failed to fetch docs meta data');
    }
  }

  private get _currentDocsName(): string | null {
    const orgName = this._currentRepo.split('/')[0];
    let result = null;
    for (const item of this._docsMetaData) {
      if (item.type === 'repo' && item.name === this._currentRepo) {
        result = item.key;
        break;
      } else if (item.type === 'org' && item.name === orgName) {
        result = item.key;
        break;
      }
    }
    return result;
  }

  public async run(): Promise<void> {
    const repoName = utils.getRepositoryInfo(window.location)!.nameWithOwner;

    if ($('#docs-gpt-chat-widget').length !== 0) {
      if ($('#docs-gpt-chat-widget').data('repo') === repoName) {
        return; // should not re-render for same repo
      } else {
        $('#docs-gpt-chat-widget').remove();
      }
    }

    this._currentRepo = repoName;
    await this._getDocsMetaData();

    const container = document.createElement('div');
    container.id = 'docs-gpt-chat-widget';
    container.className = getGithubTheme()!;
    container.dataset.repo = this._currentRepo; // mark current repo by data-repo
    render(
      <DocsGPTChatWidget
        currentRepo={this._currentRepo}
        currentDocsName={this._currentDocsName}
      />,
      container
    );
    $('body').append(container);
  }
}

export default DocsGPTChatWidgetAnchor;
