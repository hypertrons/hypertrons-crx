class SimpleTable {}

class HypertronsDashboard {
  options;
  defaultWelcome = (userName, repoName, role) => {
    let msg = 'Hello, ';
    if (userName) {
      msg += `${userName}, `;
    }
    if (repoName) {
      msg += `welcome to ${repoName}. `;
    } else {
      msg += 'welcome. ';
    }
    if (role) {
      msg += `You are ${role} of this repo.`;
    }
    return msg;
  };
  dashboardIdAndClass = 'hypertrons-mini-dashboard';
  welcomeIdAndClass = 'hypertrons-welcome-div';

  constructor(options) {
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
    let msg = this.defaultWelcome(userName, repoName, role);
    if (this.options.getWelcome) {
      msg = this.options.getWelcome(userName, repoName, role);
    }
    const root = this.getRoot();
    if (root) {
      root.prepend(
        `<div id="${this.welcomeIdAndClass}" class="${this.welcomeIdAndClass}">${msg}</div>`
      );
    }
  }

  addGraph(option, parentElement, style) {
    if (isNull(option) || isNull(parentElement)) return;
    var graphStyle = style || 'hypertrons-graph';
    // generate unique id
    var graphElementId = graphStyle + '-' + new Date().getTime().toString(36);
    parentElement.append(
      `<div id="${graphElementId}" class="${graphStyle}"></div>`
    );
    const graph = new SimpleGraph(graphElementId, option);
    return graph;
  }
}
