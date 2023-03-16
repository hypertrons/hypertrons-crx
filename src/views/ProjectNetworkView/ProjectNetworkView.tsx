import React, { useState, useEffect } from 'react';
import { Stack, Spinner } from 'office-ui-fabric-react';

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
  const developerPeriod = 90;
  const repoPeriod = 90;
  const [repoNetwork, setRepoNetwork] = useState();
  const [developerNetwork, setDeveloperNetwork] = useState();
  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());
  const [statusCode, setStatusCode] = useState<number>(200);

  useEffect(() => {
    (async () => {
      const data = await getRepoNetwork(currentRepo);
      if (data !== null) {
        setRepoNetwork(data);
      } else {
        setStatusCode(404);
      }
    })();
  }, [repoPeriod]);

  useEffect(() => {
    (async () => {
      const data = await getDeveloperNetwork(currentRepo);
      if (data !== null) {
        setDeveloperNetwork(data);
      } else {
        setStatusCode(404);
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
            {getMessageByLocale('global_period', settings.locale)}: {repoPeriod}{' '}
            {getMessageByLocale('global_day', settings.locale)}
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
              'component_activeDeveloperCollaborationNetwork_title',
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
                  'component_activeDeveloperCollaborationNetwork_description',
                  settings.locale
                )}
              </p>
              <ul style={{ margin: '0px 0 10px 15px' }}>
                <li>
                  {getMessageByLocale(
                    'component_activeDeveloperCollaborationNetwork_description_node',
                    settings.locale
                  )}
                </li>
                <li>
                  {getMessageByLocale(
                    'component_activeDeveloperCollaborationNetwork_description_edge',
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
