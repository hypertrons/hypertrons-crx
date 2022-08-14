import React, { useState, useEffect } from 'react';
import {
  Stack,
  Dropdown,
  IDropdownStyles,
  IDropdownOption,
  Spinner,
} from 'office-ui-fabric-react';
import Graph from '../../components/Graph/Graph';
import { getRepoCorrelation, getDevelopersByRepo } from '../../api/repo';
import { getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';
import ErrorPage from '../../components/ExceptionPage/ErrorPage';

interface ProjectNetworkViewProps {
  currentRepo: string;
  graphType: GraphType;
}

const ProjectNetworkView: React.FC<ProjectNetworkViewProps> = ({
  currentRepo,
  graphType,
}) => {
  const [repoCorrelationData, setRepoCorrelationData] = useState<
    IGraphData | undefined
  >();
  const [developersByRepoData, setDevelopersByRepoData] = useState<
    IGraphData | undefined
  >();
  const [repoPeriod, setRepoPeriod] = useState<string | number | undefined>(
    180
  );
  const [developerPeriod, setDeveloperPeriod] = useState<
    string | number | undefined
  >(180);
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
  const [statusCode, setStatusCode] = useState<number>(200);

  useEffect(() => {
    const getRepoCorrelationData = async () => {
      try {
        const res = await getRepoCorrelation(currentRepo);
        setRepoCorrelationData(res.data);
      } catch (e) {
        // @ts-ignore
        setStatusCode(e);
      }
    };
    getRepoCorrelationData();
  }, [repoPeriod]);

  useEffect(() => {
    const getDevelopersByRepoData = async () => {
      try {
        const res = await getDevelopersByRepo(currentRepo);
        setDevelopersByRepoData(res.data);
      } catch (e) {
        // @ts-ignore
        setStatusCode(e);
      }
    };
    getDevelopersByRepoData();
  }, [developerPeriod]);

  useEffect(() => {
    const initSettings = async () => {
      const temp = await loadSettings();
      setSettings(temp);
      setInited(true);
    };
    if (!inited) {
      initSettings();
    }
  }, [inited, settings]);

  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 120 },
  };

  const periodOptions: IDropdownOption[] = [
    {
      key: 180,
      text: `180 ${getMessageByLocale('global_day', settings.locale)}`,
    },
  ];

  const onRenderPeriodDropdownTitle = (
    options: IDropdownOption[] | undefined
  ): JSX.Element => {
    const option = options![0];
    return (
      <div>
        <span>{getMessageByLocale('global_period', settings.locale)}: </span>
        <span>{option!.text}</span>
      </div>
    );
  };

  const onRepoPeriodChange = (
    e: any,
    option: IDropdownOption | undefined
  ): void => {
    setRepoPeriod(option!.key);
  };

  const onDeveloperPeriodChange = (
    e: any,
    option: IDropdownOption | undefined
  ): void => {
    setDeveloperPeriod(option!.key);
  };

  const graphStyle = {
    width: 820,
    height: 380,
  };

  if (statusCode !== 200) {
    return <ErrorPage errorCode={statusCode} />;
  }

  if (!repoCorrelationData || !developersByRepoData) {
    return (
      <Spinner
        id="spinner_perceptor_layout"
        label={getMessageByLocale('golbal_loading', settings.locale)}
      />
    );
  }

  return (
    <div>
      <div className="hypertrons-crx-border hypertrons-crx-container">
        <Stack className="hypertrons-crx-title">
          <span>
            {getMessageByLocale(
              'component_projectCorrelationNetwork_title',
              settings.locale
            )}
          </span>
          <div className="hypertrons-crx-title-extra">
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
          <div className="col-12 col-md-8">
            <div style={{ margin: '10px 0 20px 20px' }}>
              <Graph
                graphType={graphType}
                data={repoCorrelationData!}
                style={graphStyle}
                focusedNodeID={currentRepo}
              />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div
              className="color-text-secondary"
              style={{ marginLeft: '35px', marginRight: '35px' }}
            >
              <p>
                {getMessageByLocale(
                  'component_projectCorrelationNetwork_description',
                  settings.locale
                )}
              </p>
              <ul style={{ margin: '0px 0 10px 15px' }}>
                <li>
                  {getMessageByLocale(
                    'component_projectCorrelationNetwork_description_node',
                    settings.locale
                  )}
                </li>
                <li>
                  {getMessageByLocale(
                    'component_projectCorrelationNetwork_description_edge',
                    settings.locale
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="hypertrons-crx-border hypertrons-crx-container">
        <Stack className="hypertrons-crx-title">
          <span>
            {getMessageByLocale(
              'component_activeDeveloperCollabrationNetwork_title',
              settings.locale
            )}
          </span>
          <div className="hypertrons-crx-title-extra">
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
          <div className="col-12 col-md-8">
            <div style={{ margin: '10px 0 20px 20px' }}>
              <Graph
                graphType={graphType}
                data={developersByRepoData!}
                style={graphStyle}
              />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div
              className="color-text-secondary"
              style={{ marginLeft: '35px', marginRight: '35px' }}
            >
              <p>
                {getMessageByLocale(
                  'component_activeDeveloperCollabrationNetwork_description',
                  settings.locale
                )}
              </p>
              <ul style={{ margin: '0px 0 10px 15px' }}>
                <li>
                  {getMessageByLocale(
                    'component_activeDeveloperCollabrationNetwork_description_node',
                    settings.locale
                  )}
                </li>
                <li>
                  {getMessageByLocale(
                    'component_activeDeveloperCollabrationNetwork_description_edge',
                    settings.locale
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectNetworkView;
