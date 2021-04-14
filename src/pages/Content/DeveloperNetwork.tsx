import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import { Link } from 'office-ui-fabric-react';
import GraphWithList from '../../components/Graph/GraphWithList';
import { getGraphData } from '../../api/index';
import { getMessageI18n, generateGraphDataMap } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';

export default class DeveloperNetwork extends PerceptorBase {
  private _currentDeveloper: string;
  private _ForceGraphData: NetworkData;
  private _CircularGraphData: NetworkData;

  private _developerListData: any[];
  private _repoListData: any[];

  private _forceGraphNodeColor: string;
  private _forceGraphMasterNodeColor: string;
  private _forceGraphEdgeColor: string;

  private _circularGraphNodeColor: string;
  private _circularGraphEdgeColor: string;

  constructor() {
    super();
    this.include = [
      pageDetect.isUserProfileMainTab
    ];
    this._currentDeveloper = '';
    this._ForceGraphData = {
      nodes: [],
      edges: [],
    };
    this._CircularGraphData = {
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
            title={getMessageI18n('component_developerCollabrationNetwork_title')}
            graphData={this._ForceGraphData}
            columns={developerColumns}
            listData={this._developerListData}
          />
          < GraphWithList
            layout='circular'
            title={getMessageI18n('component_mostParticipatedProjects_title')}
            graphData={this._CircularGraphData}
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
      const n = {
        name,
        value,
        symbolSize: nodeMap2Range.get(name),
        itemStyle: {
          color: name === this._currentDeveloper ? this._forceGraphMasterNodeColor : this._forceGraphNodeColor,
        }
      }
      this._ForceGraphData.nodes.push(n);
    }
    for (let [name, value] of edgeMap.entries()) {
      const source = name.split(' ')[0];
      const target = name.split(' ')[1];
      const e = {
        source,
        target,
        value,
        lineStyle: {
          width: edgeMap2Range.get(name),
          color: this._forceGraphEdgeColor,
        }
      }
      this._ForceGraphData.edges.push(e);

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
      const n = {
        name,
        value,
        symbolSize: nodeMap2Range.get(name),
        itemStyle: {
          color: this._circularGraphNodeColor
        }
      }
      this._CircularGraphData.nodes.push(n);
    }
    for (let [name, value] of edgeMap.entries()) {
      const source = name.split(' ')[0];
      const target = name.split(' ')[1];
      const e = {
        source,
        target,
        value,
        lineStyle: {
          width: edgeMap2Range.get(name),
          color: this._circularGraphEdgeColor,
        }
      }
      this._CircularGraphData.edges.push(e);
    }

    this._repoListData = rawData.nodes;
  }
}