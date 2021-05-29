import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import { Dialog, Stack, Dropdown, IDropdownStyles, IDropdownOption, Link, Text, ActionButton } from 'office-ui-fabric-react';
import { getDeveloperCollabration, getParticipatedProjects } from '../../api/developer';
import { runsWhen, getMessageI18n } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';
import { inject2Perceptor } from './Perceptor';
import { loadSettings } from '../../utils/settings';
import Graph from '../../components/Graph/Graph';
import TeachingBubbleWrapper from './TeachingBubbleWrapper'

interface DeveloperNetworkViewProps {
  currentDeveloper: string;
  graphType: any;
}

const DeveloperNetworkView: React.FC<DeveloperNetworkViewProps> = ({ currentDeveloper, graphType }) => {
  const [developerCollabrationData, setDeveloperCollabrationData] = useState<IGraphData | undefined>();
  const [participatedProjectsData, setParticipatedProjectsData] = useState<IGraphData | undefined>();
  const [developerPeriod, setDeveloperPeriod] = useState<string | number | undefined>(180);
  const [repoPeriod, setRepoPeriod] = useState<string | number | undefined>(180);
  const [showDeveloperDialog, setShowDeveloperDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);

  // get developercollabration data
  useEffect(() => {
    const getDeveloperCollabrationData = async () => {
      const res = await getDeveloperCollabration(currentDeveloper);
      if (res.status === 200) {
        setDeveloperCollabrationData(res.data)
      }
    }
    getDeveloperCollabrationData();
  }, [developerPeriod]);

  // get participated projects data
  useEffect(() => {
    const getParticipatedProjectsData = async () => {
      const res = await getParticipatedProjects(currentDeveloper);
      if (res.status === 200) {
        setParticipatedProjectsData(res.data)
      }
    }
    getParticipatedProjectsData();
  }, [repoPeriod]);

  const onProjectChartClick = (param: any, echarts: any) => {
    const url = 'https://github.com/' + param.data.name + '/pulse?type=perceptor';
    window.location.href = url;
  };

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

  const dialogProps = {
    styles: {
      main: {
        color: 'var(--color-text-primary)',
        backgroundColor: 'var(--color-bg-overlay)',
      },
      title: {
        padding: 0,
      }
    },
  };

  const graphStyle = {
    width: '400px',
    height: '380px'
  }

  const activityDefinitionLink = 'https://github.com/X-lab2017/open-digger/';

  if (!developerCollabrationData || !participatedProjectsData) {
    return (<div />);
  }
  return (
    <div className="border-top color-border-secondary pt-3 mt-3">
      <h2 className="h4 mb-2">Perceptor</h2>
      <ul className="vcard-details">
        <li className="vcard-detail pt-1 css-truncate css-truncate-target" style={{ margin: '-5px -30px' }}>
          <ActionButton
            iconProps={{ iconName: 'Group' }}
            onClick={() => {
              setShowDeveloperDialog(true)
            }}>
            <span
              title={`${getMessageI18n('global_clickToshow')} ${getMessageI18n('component_developerCollabrationNetwork_title')}`}
              className='Label'
              style={{ marginLeft: '5px!important', color: 'var(--color-text-link)' }}
            >
              {getMessageI18n('component_developerCollabrationNetwork_title')}
            </span>
          </ActionButton>
        </li>
        <li className="vcard-detail pt-1 css-truncate css-truncate-target" style={{ margin: '-5px -30px' }}>
          <ActionButton
            iconProps={{ iconName: 'BranchMerge' }}
            onClick={() => {
              setShowProjectDialog(true)
            }}>
            <span
              title={`${getMessageI18n('global_clickToshow')} ${getMessageI18n('component_mostParticipatedProjects_title')}`}
              className='Label'
              style={{ marginLeft: '5px!important', color: 'var(--color-text-link)' }}
            >
              {getMessageI18n('component_mostParticipatedProjects_title')}
            </span>
          </ActionButton>
        </li>
      </ul>
      <TeachingBubbleWrapper target="#developer-network" />

      <Dialog
        hidden={!showDeveloperDialog}
        onDismiss={() => {
          setShowDeveloperDialog(false);
        }}
        modalProps={dialogProps}
      >
        <div>
          <Stack className="hypertrons-crx-title">
            <span>{getMessageI18n('component_developerCollabrationNetwork_title')}</span>
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
                  data={developerCollabrationData!}
                  style={graphStyle}
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="color-text-secondary" style={{ marginLeft: '55px' }}>
                <p>{getMessageI18n('component_developerCollabrationNetwork_description')}</p>
                <ul style={{ margin: '0px 0 10px 15px' }}>
                  <li>{getMessageI18n('component_developerCollabrationNetwork_description_node')}</li>
                  <li>{getMessageI18n('component_developerCollabrationNetwork_description_edge')}</li>
                </ul>
                <div>
                  <span>{getMessageI18n('component_activity_description')}</span>
                  <Link href={activityDefinitionLink} underline>{getMessageI18n('global_here')}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
      <Dialog
        hidden={!showProjectDialog}
        onDismiss={() => {
          setShowProjectDialog(false);
        }}
        modalProps={dialogProps}
      >
        <div>
          <Stack className="hypertrons-crx-title">
            <span>{getMessageI18n('component_mostParticipatedProjects_title')}</span>
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
                  data={participatedProjectsData!}
                  style={graphStyle}
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="color-text-secondary" style={{ marginLeft: '55px' }}>
                <p>{getMessageI18n('component_mostParticipatedProjects_description')}</p>
                <ul style={{ margin: '0px 0 10px 15px' }}>
                  <li>{getMessageI18n('component_mostParticipatedProjects_description_node')}</li>
                  <li>{getMessageI18n('component_mostParticipatedProjects_description_edge')}</li>
                </ul>
                <div>
                  <span>{getMessageI18n('component_activity_description')}</span>
                  <Link href={activityDefinitionLink} underline>{getMessageI18n('global_here')}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}


@runsWhen([pageDetect.isUserProfileMainTab])
class DeveloperNetwork extends PerceptorBase {
  private _currentDeveloper: string;

  constructor() {
    super();
    this._currentDeveloper = '';
  }

  public async run(): Promise<void> {
    const profileArea = $('.js-profile-editable-area').parent();
    const DeveloperNetworkDiv = document.createElement('div');
    DeveloperNetworkDiv.id = 'developer-network';
    DeveloperNetworkDiv.style.width = "100%";
    this._currentDeveloper = $('.p-nickname.vcard-username.d-block').text().trim();
    const settings = await loadSettings();
    try {
      render(
        <DeveloperNetworkView
          currentDeveloper={this._currentDeveloper}
          graphType={settings.graphType}
        />
        ,
        DeveloperNetworkDiv,
      );
      profileArea.after(DeveloperNetworkDiv);
    } catch (error) {
      this.logger.error('DeveloperNetwork', error);
      return;
    }
  }
}

inject2Perceptor(DeveloperNetwork);