import { utils, isRepo } from 'github-url-detection';
import { loadSettings } from './utils/settings';
import PerceptorBase from './PerceptorBase';
import logger from './utils/logger';

export class Perceptor extends PerceptorBase {
  public static Features: Map<string, any> = new Map();
  public settings: any;

  public async run(): Promise<void> {
    logger.info('start.');

    await this.checkSettings();
    await this.loadFeatures();
  }

  private async checkSettings(): Promise<void> {
    logger.info('loading settings ...');
    if (isRepo()) {
      const owner = utils.getRepositoryInfo(window.location)!.owner;
      const repo = utils.getRepositoryInfo(window.location)!.name;
      this.settings = await loadSettings();
    } else {
      this.settings = await loadSettings();
    }
  }

  /**
   * @zh-CN 尝试加载所有 Feature，如果遇到以下情形，则跳过加载：
   * 1、被 disable 了
   * 2、该 Feature 不在该页面中运行
   *
   * @en-US load features which are enable
   */
  public async loadFeatures(): Promise<void> {
    //
    Perceptor.Features.forEach(async (Feature, name) => {
      const featureId = name
        .replace(name[0], name[0].toLowerCase())
        .replace('Anchor', '');
      logger.info('trying to load ', featureId);
      if (this.settings.toJson()[featureId] === false) {
        logger.info(featureId, 'is disabled');
        return;
      }
      if (Feature.prototype.include.every((c: () => any) => !c())) {
        logger.info(featureId, 'does NOT run on this page');
        return;
      }
      logger.info('running ', featureId);
      const feature = new Feature();
      await feature.run();
    }, this);
  }
}

export const inject2Perceptor = (constructor: Function): void => {
  Perceptor.Features.set(constructor.name, constructor);
};
