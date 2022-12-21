import React, { useState, useEffect } from 'react';

import {
  Dialog,
  Stack,
  Dropdown,
  IDropdownStyles,
  IDropdownOption,
  ActionButton,
} from 'office-ui-fabric-react';
import { getDeveloperNetwork, getRepoNetwork } from '../../api/developer';
import { getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';
import Graph from '../../components/Graph/Graph';
import TeachingBubbleWrapperView from '../TeachingBubbleWrapperView/TeachingBubbleWrapperView';
import ErrorPage from '../../components/ExceptionPage/ErrorPage';

interface DeveloperNetworkViewProps {
  currentDeveloper: string;
}

const DeveloperNetworkView: React.FC<DeveloperNetworkViewProps> = ({
  currentDeveloper,
}) => {
  const [developerNetwork, setDeveloperNetwork] = useState();
  const [repoNetwork, setRepoNetwork] = useState();
  const [developerPeriod, setDeveloperPeriod] = useState<
    string | number | undefined
  >(90);
  const [repoPeriod, setRepoPeriod] = useState<string | number | undefined>(90);
  const [showDeveloperDialog, setShowDeveloperDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
  const [statusCode, setStatusCode] = useState<number>(200);

  // get developercollabration data
  useEffect(() => {
    (async () => {
      try {
        setDeveloperNetwork(await getDeveloperNetwork(currentDeveloper));
      } catch (e) {
        // @ts-ignore
        setStatusCode(e);
      }
    })();
  }, [developerPeriod]);

  // get participated projects data
  useEffect(() => {
    (async () => {
      try {
        setRepoNetwork(await getRepoNetwork(currentDeveloper));
      } catch (e) {
        // @ts-ignore
        setStatusCode(e);
      }
    })();
  }, [repoPeriod]);

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

  const dialogProps = {
    styles: {
      main: {
        color: 'var(--color-fg-default)',
        backgroundColor: 'var(--color-canvas-default)',
      },
      title: {
        padding: 0,
      },
    },
  };

  const graphStyle = {
    width: '100%',
    height: '380px',
  };

  if (!developerNetwork || !repoNetwork) {
    return <div />;
  }
  return (
    <div className="border-top color-border-secondary pt-3 mt-3">
      <h2 className="h4 mb-2">Perceptor</h2>
      <ul className="vcard-details">
        <li className="vcard-detail pt-1" style={{ margin: '-5px -30px' }}>
          <ActionButton
            iconProps={{ iconName: 'Group' }}
            onClick={() => {
              setShowDeveloperDialog(true);
            }}
          >
            <span
              title={`${getMessageByLocale(
                'global_clickToshow',
                settings.locale
              )} ${getMessageByLocale(
                'component_developerCollabrationNetwork_title',
                settings.locale
              )}`}
              className="Label"
              style={{
                marginLeft: '5px!important',
                color: 'var(--color-fg-default)',
              }}
            >
              {getMessageByLocale(
                'component_developerCollabrationNetwork_title',
                settings.locale
              )}
            </span>
          </ActionButton>
        </li>
        <li className="vcard-detail pt-1" style={{ margin: '-5px -30px' }}>
          <ActionButton
            iconProps={{ iconName: 'BranchMerge' }}
            onClick={() => {
              setShowProjectDialog(true);
            }}
          >
            <span
              title={`${getMessageByLocale(
                'global_clickToshow',
                settings.locale
              )} ${getMessageByLocale(
                'component_mostParticipatedProjects_title',
                settings.locale
              )}`}
              className="Label"
              style={{
                marginLeft: '5px!important',
                color: 'var(--color-fg-default)',
              }}
            >
              {getMessageByLocale(
                'component_mostParticipatedProjects_title',
                settings.locale
              )}
            </span>
          </ActionButton>
        </li>
      </ul>
      <TeachingBubbleWrapperView target="#developer-network" />

      <Dialog
        hidden={!showDeveloperDialog}
        onDismiss={() => {
          setShowDeveloperDialog(false);
        }}
        modalProps={dialogProps}
      >
        {statusCode !== 200 ? (
          <ErrorPage errorCode={statusCode} />
        ) : (
          <div>
            <Stack className="hypertrons-crx-title">
              <span>
                {getMessageByLocale(
                  'component_developerCollabrationNetwork_title',
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
                    data={developerNetwork!}
                    style={graphStyle}
                    focusedNodeID={currentDeveloper}
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
                      'component_developerCollabrationNetwork_description',
                      settings.locale
                    )}
                  </p>
                  <ul style={{ margin: '0px 0 10px 15px' }}>
                    <li>
                      {getMessageByLocale(
                        'component_developerCollabrationNetwork_description_node',
                        settings.locale
                      )}
                    </li>
                    <li>
                      {getMessageByLocale(
                        'component_developerCollabrationNetwork_description_edge',
                        settings.locale
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>
      <Dialog
        hidden={!showProjectDialog}
        onDismiss={() => {
          setShowProjectDialog(false);
        }}
        modalProps={dialogProps}
      >
        {statusCode !== 200 ? (
          <ErrorPage errorCode={statusCode} />
        ) : (
          <div>
            <Stack className="hypertrons-crx-title">
              <span>
                {getMessageByLocale(
                  'component_mostParticipatedProjects_title',
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
                  <Graph data={repoNetwork!} style={graphStyle} />
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div
                  className="color-text-secondary"
                  style={{ marginLeft: '35px', marginRight: '35px' }}
                >
                  <p>
                    {getMessageByLocale(
                      'component_mostParticipatedProjects_description',
                      settings.locale
                    )}
                  </p>
                  <ul style={{ margin: '0px 0 10px 15px' }}>
                    <li>
                      {getMessageByLocale(
                        'component_mostParticipatedProjects_description_node',
                        settings.locale
                      )}
                    </li>
                    <li>
                      {getMessageByLocale(
                        'component_mostParticipatedProjects_description_edge',
                        settings.locale
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default DeveloperNetworkView;
