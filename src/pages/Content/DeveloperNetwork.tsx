import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import { Link } from 'office-ui-fabric-react';
import GraphWithList from '../../components/Graph/GraphWithList';
import { getGraphData } from '../../api';
import { runsWhen, getMessageI18n, generateGraphDataMap } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';
import { inject2Perceptor } from './Perceptor';
import { loadSettings } from '../../utils/settings';

@runsWhen([pageDetect.isUserProfileMainTab])
class DeveloperNetwork extends PerceptorBase {
  private _currentDeveloper: string;
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
    this._currentDeveloper = '';
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
    const pinnedReposDiv = $('.js-pinned-items-reorder-container').parent();
    const DeveloperNetworkDiv = document.createElement('div');
    DeveloperNetworkDiv.id = 'developer-network';
    DeveloperNetworkDiv.style.width = "100%";
    this._currentDeveloper = $('.p-nickname.vcard-username.d-block').text().trim();
    const settings=await loadSettings();
    try {
      const forceGraphDataRaw = await getGraphData(`/actor/${this._currentDeveloper}.json`);
      await this.generateForceGraphData(forceGraphDataRaw);

      const circularGraphDataRaw = await getGraphData(`/actor/${this._currentDeveloper}_top.json`);
      await this.generateCircularGraphData(circularGraphDataRaw);

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
        { key: 'column2', name: getMessageI18n('global_correlation'), fieldName: 'correlation', minWidth: 100, maxWidth: 200, isResizable: true },
        { key: 'column3', name: getMessageI18n('global_activity'), fieldName: 'activity', minWidth: 100, maxWidth: 200, isResizable: true },
      ];
      const repoColumns = [
        {
          key: 'column1',
          name: getMessageI18n('global_repo'),
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
            title={getMessageI18n('component_developerCollabrationNetwork_title')}
            graphData={this._forceGraphData}
            graphDataGraphin={this._forceGraphDataGraphin}
            columns={developerColumns}
            listData={this._developerListData}
          />
          < GraphWithList
            layout='circular'
            graphType={settings.graphType}
            title={getMessageI18n('component_mostParticipatedProjects_title')}
            graphData={this._circularGraphData}
            graphDataGraphin={this._circularGraphDataGraphin}
            columns={repoColumns}
            listData={this._repoListData}
          />
        </div>,
        DeveloperNetworkDiv,
      );
      pinnedReposDiv.before(DeveloperNetworkDiv);
    } catch (error) {
      this.logger.error('DeveloperNetwork', error);
      return;
    }
  }

  public async generateForceGraphData(rawData: any): Promise<void> {
    const { nodeMap, nodeMap2Range, edgeMap, edgeMap2Range } = generateGraphDataMap(rawData);

    for (let [name, value] of nodeMap.entries()) {
      const node = {
        name,
        value,
        symbolSize: nodeMap2Range.get(name),
        itemStyle: {
          color: name === this._currentDeveloper ? this._forceGraphMasterNodeColor : this._forceGraphNodeColor,
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
            fill: name === this._currentDeveloper ? this._forceGraphMasterNodeColor : this._forceGraphNodeColor,
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
      this._developerListData.push(listItem);
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
            fill: name === this._currentDeveloper ? this._forceGraphMasterNodeColor : this._forceGraphNodeColor,
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
            stroke: this._forceGraphEdgeColor
          }
        }
      }
      this._circularGraphDataGraphin.edges.push(edgeGraphin);
    }

    this._repoListData = rawData.nodes;
  }
}

inject2Perceptor(DeveloperNetwork);