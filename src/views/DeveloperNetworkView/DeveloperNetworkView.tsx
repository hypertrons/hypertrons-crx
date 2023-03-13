import React, { useState, useEffect } from 'react';
import { Dialog, Stack, ActionButton } from 'office-ui-fabric-react';

import { getDeveloperNetwork, getRepoNetwork } from '../../api/developer';
import { getMessageByLocale } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';
import Graph from '../../components/Graph';
import ErrorPage from '../../components/ExceptionPage/ErrorPage';

interface DeveloperNetworkViewProps {
  currentDeveloper: string;
}

const DeveloperNetworkView: React.FC<DeveloperNetworkViewProps> = ({
  currentDeveloper,
}) => {
  const developerPeriod = 90;
  const repoPeriod = 90;
  const [developerNetwork, setDeveloperNetwork] = useState();
  const [repoNetwork, setRepoNetwork] = useState();
  const [showDeveloperDialog, setShowDeveloperDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
  const [statusCode, setStatusCode] = useState<number>(200);

  // get developercollaboration data
  useEffect(() => {
    (async () => {
      const data = await getDeveloperNetwork(currentDeveloper);
      if (data !== null) {
        setDeveloperNetwork(data);
      } else {
        setStatusCode(404);
      }
    })();
  }, [developerPeriod]);

  // get participated projects data
  useEffect(() => {
    (async () => {
      const data = await getRepoNetwork(currentDeveloper);
      if (data !== null) {
        setRepoNetwork(data);
      } else {
        setStatusCode(404);
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
                'component_developerCollaborationNetwork_title',
                settings.locale
              )}`}
              className="Label"
              style={{
                marginLeft: '5px!important',
                color: 'var(--color-fg-default)',
              }}
            >
              {getMessageByLocale(
                'component_developerCollaborationNetwork_title',
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
                  'component_developerCollaborationNetwork_title',
                  settings.locale
                )}
              </span>
              <div className="hypertrons-crx-title-extra">
                {getMessageByLocale('global_period', settings.locale)}:{' '}
                {repoPeriod} {getMessageByLocale('global_day', settings.locale)}
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
                      'component_developerCollaborationNetwork_description',
                      settings.locale
                    )}
                  </p>
                  <ul style={{ margin: '0px 0 10px 15px' }}>
                    <li>
                      {getMessageByLocale(
                        'component_developerCollaborationNetwork_description_node',
                        settings.locale
                      )}
                    </li>
                    <li>
                      {getMessageByLocale(
                        'component_developerCollaborationNetwork_description_edge',
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
                {getMessageByLocale('global_period', settings.locale)}:{' '}
                {developerPeriod}{' '}
                {getMessageByLocale('global_day', settings.locale)}
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
