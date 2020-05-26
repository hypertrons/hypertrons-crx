class SimpleGraph {
  echartsElement;
  theme;
  events;
  echartObj;
  constructor(graphElementId, option, theme) {
    this.echartsElement = document.getElementById(graphElementId);
    this.theme = theme;
    this.init();
    this.render(option);
  }

  init() {
    this.echartObj = echarts.init(this.echartsElement, this.theme);
  }

  render(option) {
    this.echartObj.setOption(option);
  }

  dispose() {
    this.echartObj.dispose();
  }

  bindEvent(eventName, func) {
    // eventName should be in lowercase
    if (/^[a-z]+$/.test(eventName) && typeof func === 'function') {
      // binding event
      this.echartObj.off(eventName);
      this.echartObj.on(eventName, (param) => {
        func(param);
      });
      this.events[eventName] = func;
    }
  }

  showLoading() {
    this.echartObj.showLoading();
  }

  hideLoading() {
    this.echartObj.hideLoading();
  }

  dispatchAction(action) {
    this.echartObj.dispatchAction(action);
  }

  rebindEvents() {
    if (isNull(this.events)) return;
    // loop and bind
    for (const eventName in this.events) {
      bindEvent(eventName, events[eventName]);
    }
  }

  updateTheme(theme) {
    if (!isEqual(this.theme, theme)) {
      this.theme = theme;
      var option = this.echartObj.getOption();
      this.dispose();
      this.init();
      this.render(option);
      this.rebindEvents();
    }
  }
}
