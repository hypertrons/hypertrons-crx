import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { utils } from 'github-url-detection';
import { Stack, Dropdown, IDropdownStyles, IDropdownOption, Link } from 'office-ui-fabric-react';
import Graph from '../../components/Graph/Graph';
import { isPerceptor, runsWhen } from '../../utils/utils';
import { getRepoCorrelation, getDevelopersByRepo } from '../../api/repo';
import { getMessageI18n } from '../../utils/utils';
import { ACTIVITY_DEFINITION_LINK } from '../../constant';
import PerceptorBase from './PerceptorBase';
import { inject2Perceptor } from './Perceptor';
import { loadSettings } from '../../utils/settings';

interface ProjectNetworkViewProps {
  currentRepo: string;
  graphType: GraphType;
}

const ProjectNetworkView: React.FC<ProjectNetworkViewProps> = ({ currentRepo, graphType }) => {
  const [repoCorrelationData, setRepoCorrelationData] = useState<IGraphData | undefined>();
  const [developersByRepoData, setDevelopersByRepoData] = useState<IGraphData | undefined>();
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
    height: '380px'
  }

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
        <div className="d-flex flex-wrap flex-items-center">
          <div className="col-12 col-md-6">
            <div style={{ margin: '10px 0 20px 20px' }}>
              < Graph
                graphType={graphType}
                data={repoCorrelationData!}
                style={graphStyle}
              />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="color-text-secondary" style={{ marginLeft: '55px' }}>
              <p>{getMessageI18n('component_projectCorrelationNetwork_description')}</p>
              <ul style={{ margin: '0px 0 10px 15px' }}>
                <li>{getMessageI18n('component_projectCorrelationNetwork_description_node')}</li>
                <li>{getMessageI18n('component_projectCorrelationNetwork_description_edge')}</li>
              </ul>
              <div>
                <span>{getMessageI18n('component_activity_description')}</span>
                <Link href={ACTIVITY_DEFINITION_LINK} underline>{getMessageI18n('global_here')}</Link>
              </div>
            </div>
          </div>
        </div>
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
        <div className="d-flex flex-wrap flex-items-center">
          <div className="col-12 col-md-6">
            <div style={{ margin: '10px 0 20px 20px' }}>
              < Graph
                graphType={graphType}
                data={developersByRepoData!}
                style={graphStyle}
              />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="color-text-secondary" style={{ marginLeft: '55px' }}>
              <p>{getMessageI18n('component_activeDeveloperCollabrationNetwork_description')}</p>
              <ul style={{ margin: '0px 0 10px 15px' }}>
                <li>{getMessageI18n('component_activeDeveloperCollabrationNetwork_description_node')}</li>
                <li>{getMessageI18n('component_activeDeveloperCollabrationNetwork_description_edge')}</li>
              </ul>
              <div>
                <span>{getMessageI18n('component_activity_description')}</span>
                <Link href={ACTIVITY_DEFINITION_LINK} underline>{getMessageI18n('global_here')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

@runsWhen([isPerceptor])
class ProjectNetwork extends PerceptorBase {
  private _currentRepo: string;

  constructor() {
    super();
    this._currentRepo = '';
  }
  public async run(): Promise<void> {
    const perceptorContainer = $('#perceptor-layout').children();
    const ProjectNetworkDiv = document.createElement('div');
    ProjectNetworkDiv.id = 'project-network';
    ProjectNetworkDiv.style.width = "100%";
    this._currentRepo = utils.getRepositoryInfo(window.location)!.nameWithOwner;
    const settings = await loadSettings();
    render(
      <ProjectNetworkView
        currentRepo={this._currentRepo}
        graphType={settings.graphType}
      />,
      ProjectNetworkDiv,
    );
    perceptorContainer.prepend(ProjectNetworkDiv);
  }
}

inject2Perceptor(ProjectNetwork);