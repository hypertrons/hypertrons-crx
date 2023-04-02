import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';

import Graph from '../../../../components/Graph';
import { getMessageByLocale } from '../../../../utils/utils';
import Settings, { loadSettings } from '../../../../utils/settings';
import './react-modal.scss';

const DEVELOPER_PERIOD = 90;
const REPO_PERIOD = 90;
const GRAPH_STYLE = {
  height: '380px',
};

interface Props {
  currentRepo: string;
  developerNetwork: any;
  repoNetwork: any;
}

const View = ({
  currentRepo: currentDeveloper,
  developerNetwork,
  repoNetwork,
}: Props): JSX.Element => {
  const [settings, setSettings] = useState(new Settings());
  const [showDeveloperNetwork, setShowDeveloperNetwork] = useState(false);
  const [showRepoNetwork, setShowRepoNetwork] = useState(false);

  useEffect(() => {
    (async () => {
      setSettings(await loadSettings());
    })();
  }, []);

  return (
    <div className="border-top color-border-secondary pt-3 mt-3">
      <h2 className="h4 mb-2">Perceptor</h2>
      <ul className="vcard-details">
        <li className="vcard-detail pt-1" style={{ margin: '-5px -30px' }}>
          <button
            style={{
              border: 0,
              backgroundColor: 'transparent',
              margin: '5px 0',
            }}
            onClick={() => {
              setShowDeveloperNetwork(true);
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
                fontWeight: 'var(--base-text-weight-normal, 400)',
              }}
            >
              {getMessageByLocale(
                'component_developerCollaborationNetwork_title',
                settings.locale
              )}
            </span>
          </button>
        </li>
        <li className="vcard-detail pt-1" style={{ margin: '-5px -30px' }}>
          <button
            style={{
              border: 0,
              backgroundColor: 'transparent',
              margin: '10px 0',
            }}
            onClick={() => {
              setShowRepoNetwork(true);
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
                fontWeight: 'var(--base-text-weight-normal, 400)',
              }}
            >
              {getMessageByLocale(
                'component_mostParticipatedProjects_title',
                settings.locale
              )}
            </span>
          </button>
        </li>
      </ul>
      <ReactModal
        className="ReactModal__Content_Custom"
        overlayClassName="ReactModal__Overlay_Custom"
        isOpen={showDeveloperNetwork}
        onRequestClose={() => {
          setShowDeveloperNetwork(false);
        }}
        ariaHideApp={false}
      >
        <div>
          <div className="hypertrons-crx-title">
            <span>
              {getMessageByLocale(
                'component_developerCollaborationNetwork_title',
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
                  data={developerNetwork}
                  style={GRAPH_STYLE}
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
      </ReactModal>
      <ReactModal
        className="ReactModal__Content_Custom"
        overlayClassName="ReactModal__Overlay_Custom"
        isOpen={showRepoNetwork}
        onRequestClose={() => {
          setShowRepoNetwork(false);
        }}
        ariaHideApp={false}
      >
        <div>
          <div className="hypertrons-crx-title">
            <span>
              {getMessageByLocale(
                'component_mostParticipatedProjects_title',
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
                <Graph data={repoNetwork} style={GRAPH_STYLE} />
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
      </ReactModal>
    </div>
  );
};

export default View;
