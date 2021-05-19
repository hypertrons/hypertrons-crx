import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { utils } from 'github-url-detection';
import { Stack, Dropdown, IDropdownStyles, IDropdownOption, Link } from 'office-ui-fabric-react';
import Graph, { VisualMapOption } from '../../components/Graph/Graph';
import ErrorPage from '../../components/ExceptionPage/index';
import { isPerceptor, runsWhen } from '../../utils/utils';
import { getRepoCorrelation, getDevelopersByRepo } from '../../api/repo';
import { getMessageI18n } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';
import { inject2Perceptor } from './Perceptor';
import { loadSettings } from '../../utils/settings';

interface ProjectNetworkViewProps {
  currentRepo: string;
  graphType: any;
}

const ProjectNetworkView: React.FC<ProjectNetworkViewProps> = ({ currentRepo, graphType }) => {
  const [repoCorrelationData, setRepoCorrelationData] = useState<NetworkData | undefined>();
  const [developersByRepoData, setDevelopersByRepoData] = useState<NetworkData | undefined>();
  const [repoPeriod, setRepoPeriod] = useState<string | number | undefined>(180);
  const [developerPeriod, setDeveloperPeriod] = useState<string | number | undefined>(180);

  useEffect(() => {
    const getRepoCorrelationData = async () => {
      const res = await getRepoCorrelation(currentRepo);
      if (res.status === 200) {
        setRepoCorrelationData(res.data)
      }
    }
    getRepoCorrelationData();
  }, [repoPeriod]);

  useEffect(() => {
    const getDevelopersByRepoData = async () => {
      const res = await getDevelopersByRepo(currentRepo);
      if (res.status === 200) {
        setDevelopersByRepoData(res.data)
      }
    }
    getDevelopersByRepoData();
  }, [developerPeriod]);

  const onProjectChartClick = (param: any, echarts: any) => {
    const url = 'https://github.com/' + param.data.name + '/pulse?type=perceptor';
    window.location.href = url;
  };

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

  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 120 }
  }

  const periodOptions: IDropdownOption[] = [
    { key: 180, text: `180 ${getMessageI18n("global_day")}` }
  ]

  const onRenderPeriodDropdownTitle = (options: IDropdownOption[] | undefined): JSX.Element => {
    const option = options![0];
    return (
      <div>
        <span>{getMessageI18n("global_period")}: </span>
        <span>{option!.text}</span>
      </div>
    );
  }

  const onRepoPeriodChange = (e: any, option: IDropdownOption | undefined): void => {
    setRepoPeriod(option!.key);
  }

  const onDeveloperPeriodChange = (e: any, option: IDropdownOption | undefined): void => {
    setDeveloperPeriod(option!.key);
  }

  const graphStyle = {
    width: '500px',
    height: '260px'
  }

  const activityDefinitionLink = 'https://github.com/X-lab2017/open-digger/';

  if (!repoCorrelationData || !developersByRepoData) {
    return (<div />);
  }

  return (
    <div>
      <div className="hypertrons-crx-border hypertrons-crx-container">
        <Stack className="hypertrons-crx-title">
          <span>{getMessageI18n('component_projectCorrelationNetwork_title')}</span>
          <div className='hypertrons-crx-title-extra'>
            <Dropdown
              defaultSelectedKey={repoPeriod}
              options={periodOptions}
              styles={dropdownStyles}
              onRenderTitle={onRenderPeriodDropdownTitle}
              onChange={onRepoPeriodChange}
            />
          </div>
        </Stack>
        <Stack
          horizontal
          tokens={{
            childrenGap: 15
          }}>
          <Stack
            horizontal
            style={{ margin: '10px 0 20px 20px', width: '50%' }}>
            < Graph
              graphType={graphType}
              data={repoCorrelationData!}
              onChartClick={onProjectChartClick}
              style={graphStyle}
            />
          </Stack>
          <Stack
            style={{
              position: 'relative',
              width: '50%',
              margin: '55px',
              fontSize: '16px!important',
              lineHeight: '28px'
            }}
          >
            <p>{getMessageI18n('component_projectCorrelationNetwork_description')}</p>
            <ul style={{ margin: '0px 0 10px 15px' }}>
              <li>{getMessageI18n('component_projectCorrelationNetwork_description_node')}</li>
              <li>{getMessageI18n('component_projectCorrelationNetwork_description_edge')}</li>
            </ul>
            <div>
              <span>{getMessageI18n('component_activity_description')}</span>
              <Link href={activityDefinitionLink} underline>{getMessageI18n('global_here')}</Link>
            </div>
          </Stack>
        </Stack>
      </div>
      <div className="hypertrons-crx-border hypertrons-crx-container">
        <Stack className="hypertrons-crx-title">
          <span>{getMessageI18n('component_activeDeveloperCollabrationNetwork_title')}</span>
          <div className='hypertrons-crx-title-extra'>
            <Dropdown
              defaultSelectedKey={developerPeriod}
              options={periodOptions}
              styles={dropdownStyles}
              onRenderTitle={onRenderPeriodDropdownTitle}
              onChange={onDeveloperPeriodChange}
            />
          </div>
        </Stack>
        <Stack
          horizontal
          tokens={{
            childrenGap: 15
          }}>
          <Stack
            horizontal
            style={{ margin: '10px 0 20px 20px', width: '50%' }}>
            < Graph
              graphType={graphType}
              data={developersByRepoData!}
              visualMapOption={visualMapOption}
              style={graphStyle}
            />
          </Stack>
          <Stack
            style={{
              position: 'relative',
              width: '50%',
              margin: '55px',
              fontSize: '16px!important',
              lineHeight: '28px'
            }}
          >
            <p>{getMessageI18n('component_activeDeveloperCollabrationNetwork_description')}</p>
            <ul style={{ margin: '0px 0 10px 15px' }}>
              <li>{getMessageI18n('component_activeDeveloperCollabrationNetwork_description_node')}</li>
              <li>{getMessageI18n('component_activeDeveloperCollabrationNetwork_description_edge')}</li>
            </ul>
            <div>
              <span>{getMessageI18n('component_activity_description')}</span>
              <Link href={activityDefinitionLink} underline>{getMessageI18n('global_here')}</Link>
            </div>
          </Stack>
        </Stack>
      </div>
    </div>
  )
}

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
      const settings = await loadSettings();
      render(
        <ProjectNetworkView
          currentRepo={this._currentRepo}
          graphType={settings.graphType}
        />,
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