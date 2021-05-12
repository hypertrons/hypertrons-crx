import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { utils } from 'github-url-detection';
import Graph, { VisualMapOption } from '../../components/Graph/Graph';
import ErrorPage from '../../components/ExceptionPage/index';
import { isPerceptor, runsWhen } from '../../utils/utils';
import { getRepoCorrelation, getDevelopersByRepo } from '../../api/repo';
import { getMessageI18n } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';
import { inject2Perceptor } from './Perceptor';
import { loadSettings } from '../../utils/settings';

const onProjectChartClick = (param: any, echarts: any) => {
  const url = 'https://github.com/' + param.data.name + '/pulse?type=perceptor';
  window.location.href = url;
};

@runsWhen([isPerceptor])
class ProjectNetwork extends PerceptorBase {
  private _currentRepo: string;
  private _repoCorrelationData: NetworkData;
  private _developersByRepoData: NetworkData;

  constructor() {
    super();
    this._currentRepo = '';
    this._repoCorrelationData = {
      nodes: [],
      edges: [],
    };
    this._developersByRepoData = {
      nodes: [],
      edges: [],
    };
  }
  public async run(): Promise<void> {
    const perceptorContainer = $('#perceptor-layout').children();
    const ProjectNetworkDiv = document.createElement('div');
    ProjectNetworkDiv.id = 'project-network';
    ProjectNetworkDiv.style.width = "100%";
    this._currentRepo = utils.getRepositoryInfo(window.location)!.nameWithOwner;
    try {
      this._repoCorrelationData = (await getRepoCorrelation(this._currentRepo)).data;
      this._developersByRepoData = (await getDevelopersByRepo(this._currentRepo)).data;

      const settings = await loadSettings();

      const visualMapOption: VisualMapOption = {
        node: {
          min: 0,
          max: 30,
          symbolSize: [5, 10]
        },
        edge: {
          min: 0,
          max: 20,
          width: [1, 3]
        }
      }
      render(
        <div>
          < Graph
            title={getMessageI18n('component_projectCorrelationNetwork_title')}
            graphType={settings.graphType}
            data={this._repoCorrelationData}
            onChartClick={onProjectChartClick}
          />
          < Graph
            title={getMessageI18n('component_activeDeveloperCollabrationNetwork_title')}
            graphType={settings.graphType}
            data={this._developersByRepoData}
            visualMapOption={visualMapOption}
          />
        </div>,
        ProjectNetworkDiv,
      );
    } catch (error) {
      this.logger.error('projectNetwork', error);
      render(
        <ErrorPage />,
        ProjectNetworkDiv,
      );
    }
    perceptorContainer.prepend(ProjectNetworkDiv);
  }
}

inject2Perceptor(ProjectNetwork);