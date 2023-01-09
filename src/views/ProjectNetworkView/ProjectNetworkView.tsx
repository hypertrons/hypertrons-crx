import React, { useState, useEffect } from 'react';
import {
  Stack,
  Dropdown,
  IDropdownStyles,
  IDropdownOption,
  Spinner,
} from 'office-ui-fabric-react';
import Graph from '../../components/Graph';
import { getRepoNetwork, getDeveloperNetwork } from '../../api/repo';
import { getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';
import ErrorPage from '../../components/ExceptionPage/ErrorPage';

interface ProjectNetworkViewProps {
  currentRepo: string;
}

const ProjectNetworkView: React.FC<ProjectNetworkViewProps> = ({
  currentRepo,
}) => {
  const [repoNetwork, setRepoNetwork] = useState();
  const [developerNetwork, setDeveloperNetwork] = useState();
  const [repoPeriod, setRepoPeriod] = useState<string | number | undefined>(90);
  const [developerPeriod, setDeveloperPeriod] = useState<
    string | number | undefined
  >(90);
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
  const [statusCode, setStatusCode] = useState<number>(200);

  useEffect(() => {
    (async () => {
      try {
        setRepoNetwork(await getRepoNetwork(currentRepo));
      } catch (e) {
        // @ts-ignore
        setStatusCode(e);
      }
    })();
  }, [repoPeriod]);

  useEffect(() => {
    (async () => {
      try {
        setDeveloperNetwork(await getDeveloperNetwork(currentRepo));
      } catch (e) {
        // @ts-ignore
        setStatusCode(e);
      }
    })();
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
      key: 90,
      text: `90 ${getMessageByLocale('global_day', settings.locale)}`,
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
    width: '100%',
    height: '380px',
  };

  if (statusCode !== 200) {
    return <ErrorPage errorCode={statusCode} />;
  }

  if (!repoNetwork || !developerNetwork) {
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
                data={repoNetwork!}
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
              <Graph data={developerNetwork!} style={graphStyle} />
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
