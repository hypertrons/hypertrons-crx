import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { Link } from 'office-ui-fabric-react';
import { utils } from 'github-url-detection';
import GraphWithList from '../../components/Graph/GraphWithList';
import ErrorPage from '../../components/ExceptionPage/index';
import { isPerceptor, runsWhen } from '../../utils/utils';
import { getRepoCorrelation,  getDevelopersByRepo} from '../../api/repo';
import { getMessageI18n, generateGraphDataMap } from '../../utils/utils';
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
  private _forceGraphData: NetworkData;
  private _circularGraphData: NetworkData;
  private _forceGraphDataGraphin: NetworkData;
  private _circularGraphDataGraphin: NetworkData;

  private _developerListData: any[];
  private _repoListData: any[];

  private _forceGraphNodeColor: string;
  private _forceGraphMasterNodeColor: string;
  private _forceGraphEdgeColor: string;

  private _circularGraphNodeColor: string;
  private _circularGraphEdgeColor: string;

  constructor() {
    super();
    this._currentRepo = '';
    this._forceGraphData = {
      nodes: [],
      edges: [],
    };
    this._circularGraphData = {
      nodes: [],
      edges: [],
    };
    this._forceGraphDataGraphin = {
      nodes: [],
      edges: [],
    };
    this._circularGraphDataGraphin = {
      nodes: [],
      edges: [],
    };
    this._developerListData = [];
    this._repoListData = [];

    this._forceGraphNodeColor = '#28a745';
    this._forceGraphMasterNodeColor = '#fb8532';
    this._forceGraphEdgeColor = 'green';

    this._circularGraphNodeColor = '#5470c6';
    this._circularGraphEdgeColor = '#5470c6';
  }
  public async run(): Promise<void> {
    const perceptorContainer = $('#perceptor-layout').children();
    const ProjectNetworkDiv = document.createElement('div');
    ProjectNetworkDiv.id = 'project-network';
    ProjectNetworkDiv.style.width = "100%";
    this._currentRepo = utils.getRepositoryInfo(window.location)!.nameWithOwner;
    try {
      const forceGraphDataRaw = await getRepoCorrelation(this._currentRepo);
      await this.generateForceGraphData(forceGraphDataRaw);

      const circularGraphDataRaw = await getDevelopersByRepo(this._currentRepo);
      await this.generateCircularGraphData(circularGraphDataRaw);
      const settings=await loadSettings();

      const repoColumns = [
        {
          key: 'column1',
          name: getMessageI18n('global_project'),
          fieldName: 'name',
          minWidth: 100,
          maxWidth: 200,
          isResizable: true,
          onRender: (item: any) => (
            <Link href={'https://github.com/' + item.name} >
              {item.name}
            </Link>
          ),
        },
        { key: 'column2', name: getMessageI18n('global_correlation'), fieldName: 'correlation', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column3', name: getMessageI18n('global_activity'), fieldName: 'activity', minWidth: 100, maxWidth: 200, isResizable: true },
      ];
      const developerColumns = [
        {
          key: 'column1',
          name: getMessageI18n('global_developer'),
          fieldName: 'name',
          minWidth: 100,
          maxWidth: 200,
          isResizable: true,
          onRender: (item: any) => (
            <Link href={'https://github.com/' + item.name} >
              {item.name}
            </Link>
          ),
        },
        { key: 'column2', name: getMessageI18n('global_contribution'), fieldName: 'value', minWidth: 100, maxWidth: 200, isResizable: true },
      ];

      render(
        <div>
          < GraphWithList
            layout='force'
            graphType={settings.graphType}
            title={getMessageI18n('component_projectCorrelationNetwork_title')}
            graphData={this._forceGraphData}
            graphDataGraphin={this._forceGraphDataGraphin}
            columns={repoColumns}
            listData={this._repoListData}
            onChartClick={onProjectChartClick}
          />
          < GraphWithList
            layout='force'
            graphType={settings.graphType}
            title={getMessageI18n('component_activeDeveloperCollabrationNetwork_title')}
            graphData={this._circularGraphData}
            graphDataGraphin={this._circularGraphDataGraphin}
            columns={developerColumns}
            listData={this._developerListData}
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

  public async generateForceGraphData(rawData: any): Promise<void> {
    const { nodeMap, nodeMap2Range, edgeMap, edgeMap2Range } = generateGraphDataMap(rawData);

    for (let [name, value] of nodeMap.entries()) {
      const node = {
        name,
        value,
        symbolSize: nodeMap2Range.get(name),
        itemStyle: {
          color: name === this._currentRepo ? this._forceGraphMasterNodeColor : this._forceGraphNodeColor,
        }
      }
      this._forceGraphData.nodes.push(node);

      const nodeGraphin = {
        id:name,
        type:"graphin-circle",
        style:{
          label:{
            value:name
          },
          keyshape: {
            size: nodeMap2Range.get(name),
            fill: name === this._currentRepo ? this._forceGraphMasterNodeColor : this._forceGraphNodeColor,
          },
          badges: [
            {
              position: 'RT',
              type: 'text',
              value: value.toFixed(2),
              size: [20, 20],
              color: '#000'
            },
          ],
        }
      }
      this._forceGraphDataGraphin.nodes.push(nodeGraphin);

    }
    for (let [name, value] of edgeMap.entries()) {
      const source = name.split(' ')[0];
      const target = name.split(' ')[1];
      const edge = {
        source,
        target,
        value,
        lineStyle: {
          width: edgeMap2Range.get(name),
          color: this._forceGraphEdgeColor,
        }
      }
      this._forceGraphData.edges.push(edge);

      const edgeGraphin = {
        source,
        target,
        style:{
          keyshape:{
            lineWidth:edgeMap2Range.get(name),
            stroke: this._forceGraphEdgeColor
          }
        }
      }
      this._forceGraphDataGraphin.edges.push(edgeGraphin);

      // generate list data
      const listItem = {
        name: target,
        correlation: value,
        activity: nodeMap.get(target),
      }
      this._repoListData.push(listItem);
    }
  }

  public async generateCircularGraphData(rawData: any): Promise<void> {
    const { nodeMap, nodeMap2Range, edgeMap, edgeMap2Range } = generateGraphDataMap(rawData);

    for (let [name, value] of nodeMap.entries()) {
      const node = {
        name,
        value,
        symbolSize: nodeMap2Range.get(name),
        itemStyle: {
          color: this._circularGraphNodeColor
        }
      }
      this._circularGraphData.nodes.push(node);

      const nodeGraphin = {
        id:name,
        type:"graphin-circle",
        style:{
          label:{
            value:name
          },
          keyshape: {
            size: nodeMap2Range.get(name),
            fill: this._circularGraphNodeColor,
          },
          badges: [
            {
              position: 'RT',
              type: 'text',
              value: value.toFixed(2),
              size: [20, 20],
              color: '#000'
            },
          ],
        }
      }
      this._circularGraphDataGraphin.nodes.push(nodeGraphin);

    }
    for (let [name, value] of edgeMap.entries()) {
      const source = name.split(' ')[0];
      const target = name.split(' ')[1];
      const edge = {
        source,
        target,
        value,
        lineStyle: {
          width: edgeMap2Range.get(name),
          color: this._circularGraphEdgeColor,
        }
      }
      this._circularGraphData.edges.push(edge);

      const edgeGraphin = {
        source,
        target,
        style:{
          keyshape:{
            lineWidth:edgeMap2Range.get(name),
            stroke: this._circularGraphEdgeColor
          }
        }
      }
      this._circularGraphDataGraphin.edges.push(edgeGraphin);
    }

    this._developerListData = rawData.nodes;
  }
}

inject2Perceptor(ProjectNetwork);