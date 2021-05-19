import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import { Dialog, DialogType, Image, Stack, Dropdown, IDropdownStyles, IDropdownOption, Link } from 'office-ui-fabric-react';
import { getDeveloperCollabration, getParticipatedProjects } from '../../api/developer';
import { runsWhen, getMessageI18n } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';
import { inject2Perceptor } from './Perceptor';
import { loadSettings } from '../../utils/settings';
import Graph, { VisualMapOption } from '../../components/Graph/Graph';
import TeachingBubbleWrapper from './TeachingBubbleWrapper'

interface DeveloperNetworkViewProps {
  currentDeveloper: string;
  graphType: any;
}

const DeveloperNetworkView: React.FC<DeveloperNetworkViewProps> = ({ currentDeveloper, graphType }) => {
  const [developerCollabrationData, setDeveloperCollabrationData] = useState<NetworkData | undefined>();
  const [participatedProjectsData, setParticipatedProjectsData] = useState<NetworkData | undefined>();
  const [developerPeriod, setDeveloperPeriod] = useState<string | number | undefined>(180);
  const [repoPeriod, setRepoPeriod] = useState<string | number | undefined>(180);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const getDeveloperCollabrationData = async () => {
      const res = await getDeveloperCollabration(currentDeveloper);
      if (res.status === 200) {
        setDeveloperCollabrationData(res.data)
      }
    }
    getDeveloperCollabrationData();
  }, [developerPeriod]);

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
    width: '400px',
    height: '260px'
  }

  const activityDefinitionLink = 'https://github.com/X-lab2017/open-digger/';

  if (!developerCollabrationData || !participatedProjectsData) {
    return (<div />);
  }
  return (
    <div
      className="border-top color-border-secondary pt-3 mt-3"
    >
      <h2 className="h4 mb-2">
        Hypertrons
        </h2>
      <Image
        id="charts_icon"
        src={chrome.runtime.getURL("charts.png")}
        height={50}
        width={50}
        onClick={() => {
          setShowDialog(true)
        }}
      />
      <TeachingBubbleWrapper target="#charts_icon" />
      <Dialog
        hidden={!showDialog}
        onDismiss={() => {
          setShowDialog(false);
        }}
        dialogContentProps={{
          type: DialogType.normal,
          title: getMessageI18n("component_projectNetwork_title")
        }}
      >
        <div className="hypertrons-crx-border hypertrons-crx-container">
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
          <Stack
            horizontal
            tokens={{
              childrenGap: 15
            }}>
            <Stack
              horizontal
              style={{
                margin: '5px 0 10px 10px',
                width: '50%'
              }}>
              < Graph
                graphType={graphType}
                data={developerCollabrationData!}
                style={graphStyle}
              />
            </Stack>
            <Stack
              style={{
                position: 'relative',
                width: '50%',
                margin: '45px',
                fontSize: '16px!important',
                lineHeight: '25px'
              }}
            >
              <p>{getMessageI18n('component_developerCollabrationNetwork_description')}</p>
              <ul style={{ margin: '0px 0 10px 15px' }}>
                <li>{getMessageI18n('component_developerCollabrationNetwork_description_node')}</li>
                <li>{getMessageI18n('component_developerCollabrationNetwork_description_edge')}</li>
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
          <Stack
            horizontal
            tokens={{
              childrenGap: 15
            }}>
            <Stack
              horizontal
              style={{
                margin: '5px 0 10px 10px',
                width: '50%'
              }}>
              < Graph
                graphType={graphType}
                data={participatedProjectsData!}
                visualMapOption={visualMapOption}
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
              <p>{getMessageI18n('component_mostParticipatedProjects_description')}</p>
              <ul style={{ margin: '0px 0 10px 15px' }}>
                <li>{getMessageI18n('component_mostParticipatedProjects_description_node')}</li>
                <li>{getMessageI18n('component_mostParticipatedProjects_description_edge')}</li>
              </ul>
              <div>
                <span>{getMessageI18n('component_activity_description')}</span>
                <Link href={activityDefinitionLink} underline>{getMessageI18n('global_here')}</Link>
              </div>
            </Stack>
          </Stack>
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