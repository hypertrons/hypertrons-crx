import React, { useState, useEffect } from 'react';

import Graph from '../../../../components/Graph';
import { getMessageByLocale } from '../../../../utils/utils';
import { defaultSettings, loadSettings } from '../../../../utils/settings';

const DEVELOPER_PERIOD = 90;
const REPO_PERIOD = 90;

interface Props {
  currentRepo: string;
  repoNetwork: any;
  developerNetwork: any;
}

const View = ({
  currentRepo,
  repoNetwork,
  developerNetwork,
}: Props): JSX.Element => {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    (async () => {
      setSettings(await loadSettings());
    })();
  }, []);

  const graphStyle = {
    width: '100%',
    height: '380px',
  };

  return (
    <div>
      <div className="hypertrons-crx-border hypertrons-crx-container">
        <div className="hypertrons-crx-title">
          <span>
            {getMessageByLocale(
              'component_projectCorrelationNetwork_title',
              settings.locale
            )}
          </span>
          <div className="hypertrons-crx-title-extra">
            {getMessageByLocale('global_period', settings.locale)}:{' '}
            {REPO_PERIOD} {getMessageByLocale('global_day', settings.locale)}
          </div>
        </div>
        <div className="d-flex flex-wrap flex-items-center">
          <div className="col-12 col-md-8">
            <div style={{ margin: '10px 0 20px 20px' }}>
              <Graph
                data={repoNetwork}
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
        <div className="hypertrons-crx-title">
          <span>
            {getMessageByLocale(
              'component_activeDeveloperCollaborationNetwork_title',
              settings.locale
            )}
          </span>
          <div className="hypertrons-crx-title-extra">
            {getMessageByLocale('global_period', settings.locale)}:{' '}
            {DEVELOPER_PERIOD}{' '}
            {getMessageByLocale('global_day', settings.locale)}
          </div>
        </div>
        <div className="d-flex flex-wrap flex-items-center">
          <div className="col-12 col-md-8">
            <div style={{ margin: '10px 0 20px 20px' }}>
              <Graph data={developerNetwork} style={graphStyle} />
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

export default View;
