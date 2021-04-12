import $ from 'jquery';
import elementReady from 'element-ready';
import { utils, isRepo } from 'github-url-detection';
import { loadSettings, mergeSettings } from '../../utils/settings'
import { getConfigFromGithub } from '../../api/github';
import { Inject } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';
import PerceptorTab from './PerceptorTab';
import PerceptorLayout from './PerceptorLayout';
import DeveloperNetwork from './DeveloperNetwork';
import ProjectNetwork from './ProjectNetwork';

@Inject([
  PerceptorTab,
  PerceptorLayout,
  DeveloperNetwork,
  ProjectNetwork
])
class Perceptor extends PerceptorBase {
  public static features: Map<string, any> = new Map();
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
    Perceptor.features.forEach(async (feature, name) => {
      this.logger.info('trying to load ', name)
      if (this.settings.toJson()[name] === false) {
        this.logger.info(name, 'is disabled');
        return;
      }
      if (feature.include.every((c: () => any) => !c())) {
        return;
      }
      try {
        this.logger.info('running ', name)
        await feature.run();
      } catch (error: unknown) {
        this.logger.error(name, error)
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
      this.settings = await mergeSettings(configFromGithub);
    } else {
      this.settings = await loadSettings();
    }
  }

}

export default Perceptor;

