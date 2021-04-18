import $ from 'jquery';
import elementReady from 'element-ready';
import { utils, isRepo } from 'github-url-detection';
import { loadSettings, mergeSettings } from '../../utils/settings'
import { getConfigFromGithub } from '../../api/github';
import PerceptorBase from './PerceptorBase';

export class Perceptor extends PerceptorBase {
  public static Features: Map<string, any> = new Map();
  public settings: any;

  public async run(): Promise<void> {
    // wait until <body> element is ready
    await elementReady('body', { waitForChildren: false });
    this.logger.info('body element is ready.');

    this.logger.info('creating perceptor div ...');
    const perceptorDiv = document.createElement('div');
    perceptorDiv.id = 'perceptor';
    $('#js-repo-pjax-container').prepend(perceptorDiv);

    await this.checkSettings();

    // run every features
    Perceptor.Features.forEach(async (Feature, name) => {
      const featureId = name.replace(name[0],name[0].toLowerCase());
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
}

export const inject2Perceptor = (constructor: Function): void => {
  Perceptor.Features.set(constructor.name, constructor)
}

