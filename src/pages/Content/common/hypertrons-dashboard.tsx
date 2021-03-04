import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { elementExists } from '../../../utils/utils';
import Welcome from '../components/Welcome/index';

export class HypertronsDashboard {
  options: {
    getInsertElement?: any;
    insertType?: any;
    welcome?: any;
    getWelcome?: any;
    userName?: any;
    repoName?: any;
    role?: any;
  };

  dashboardIdAndClass = 'hypertrons-mini-dashboard';

  constructor(options: {
    getInsertElement?: any;
    insertType?: any;
    welcome?: any;
    getWelcome?: any;
    userName?: any;
    repoName?: any;
    role?: any;
  }) {
    this.options = options;

    this.init();
    this.insertItems();
  }

  init() {
    if (!this.options.getInsertElement) {
      return;
    }
    const ele = this.options.getInsertElement();
    if (elementExists(ele)) {
      const insertItem = `<div id="${this.dashboardIdAndClass}" class="${this.dashboardIdAndClass}"></div>`;
      switch (this.options.insertType) {
        case 'before':
          ele.before(insertItem);
          break;
        case 'after':
          ele.after(insertItem);
          break;
        default:
          break;
      }
    }
  }

  insertItems() {
    this.insertWelcome();
  }

  getRoot() {
    const root = $(`#${this.dashboardIdAndClass}`);
    if (elementExists(root)) {
      return root;
    }
    return null;
  }

  insertWelcome() {
    if (this.options.welcome === false) return;
    const { userName, repoName, role } = this.options;
    const root = this.getRoot();
    if (root) {
      const welcomeDiv = document.createElement('div');
      welcomeDiv.id = 'hypertrons-welcome-container';
      if (this.options.getWelcome) {
        ReactDOM.render(
          <Welcome
            userName={userName}
            repoName={repoName}
            role={role}
            welcomeMsg={this.options.getWelcome}
          />,
          welcomeDiv,
        );
      } else {
        ReactDOM.render(
          <Welcome userName={userName} repoName={repoName} role={role} />,
          welcomeDiv,
        );
      }
      root.prepend(welcomeDiv);
    }
  }
}
