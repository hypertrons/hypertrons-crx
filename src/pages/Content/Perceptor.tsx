import { utils, isRepo } from 'github-url-detection';
import { loadSettings, mergeSettings } from '../../utils/settings'
import { getConfigFromGithub } from '../../api/github';
import PerceptorBase from './PerceptorBase';

export class Perceptor extends PerceptorBase {
  public static Features: Map<string, any> = new Map();
  public settings: any;

  public async run(): Promise<void> {
    this.logger.info('start.');

    await this.checkSettings();
    await this.loadFeatures();
    /**
     * @zh-CN 检测到页面更新加载时，自动重新运行一次
     * @en-US Automatically rerun once when page update loading is detected
    */
    document.addEventListener('pjax:end', async () => {
      await this.loadFeatures();
    });
  }

  private async checkSettings(): Promise<void> {
    this.logger.info('loading settings ...');
    if (isRepo()) {
      this.logger.info('Detected that this is a repo page, trying to load configuration file from the repo ...');
      const owner = utils.getRepositoryInfo(window.location)!.owner;
      const repo = utils.getRepositoryInfo(window.location)!.name;
      const configFromGithub = await getConfigFromGithub(owner, repo);
      this.logger.info('The configurations are: ', configFromGithub);
      this.settings = await mergeSettings(configFromGithub);
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
      const featureId = name.replace(name[0], name[0].toLowerCase());
      this.logger.info('trying to load ', featureId)
      if (this.settings.toJson()[featureId] === false) {
        this.logger.info(featureId, 'is disabled');
        return;
      }
      if (Feature.prototype.include.every((c: () => any) => !c())) {
        this.logger.info(featureId, 'does NOT run on this page')
        return;
      }
      try {
        this.logger.info('running ', featureId)
        const feature = new Feature();
        await feature.run();
      } catch (error: unknown) {
        this.logger.error(featureId, error)
      }
    }, this)
  }

}

export const inject2Perceptor = (constructor: Function): void => {
  Perceptor.Features.set(constructor.name, constructor)
}