import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';

import Graph from '../../../../components/Graph';
// import getMessageByLocale from '../../../../helpers/get-message-by-locale';
import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import { iconDeveloperNetwork, iconRepoNetwork } from './icon-svg-path';
import './react-modal.scss';
import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';
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

const View = ({ currentRepo: currentDeveloper, developerNetwork, repoNetwork }: Props): JSX.Element => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const [showDeveloperNetwork, setShowDeveloperNetwork] = useState(false);
  const [showRepoNetwork, setShowRepoNetwork] = useState(false);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
    })();
  }, [options.locale]);

  return (
    <div className="border-top color-border-secondary pt-3 mt-3">
      <h2 className="h4 mb-2">Perceptor</h2>
      <ul className="vcard-details">
        <li className="vcard-detail pt-1">
          <svg
            className="octicon octicon-clock"
            viewBox="0 0 1024 1024"
            version="1.1"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <path d={iconDeveloperNetwork}></path>
          </svg>
          <button
            style={{
              border: 0,
              padding: '1px 0',
              backgroundColor: 'transparent',
            }}
            onClick={() => {
              setShowDeveloperNetwork(true);
            }}
          >
            <span
              title={`${t('global_clickToshow')} ${t('component_developerCollaborationNetwork_title')}`}
              className="Label"
              style={{
                color: 'var(--color-fg-default)',
                fontWeight: 'var(--base-text-weight-normal, 400)',
              }}
            >
              {t('component_developerCollaborationNetwork_title')}
            </span>
          </button>
        </li>
        <li className="vcard-detail pt-1">
          <svg
            className="octicon octicon-clock"
            viewBox="0 0 1024 1024"
            version="1.1"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <path d={iconRepoNetwork}></path>
          </svg>
          <button
            style={{
              border: 0,
              padding: '1px 0',
              backgroundColor: 'transparent',
            }}
            onClick={() => {
              setShowRepoNetwork(true);
            }}
          >
            <span
              title={`${t('global_clickToshow')} ${t('component_mostParticipatedProjects_title')}`}
              className="Label"
              style={{
                color: 'var(--color-fg-default)',
                fontWeight: 'var(--base-text-weight-normal, 400)',
              }}
            >
              {t('component_mostParticipatedProjects_title')}
            </span>
          </button>
        </li>
      </ul>
      <ReactModal
        className="ReactModal__Content_Custom"
        overlayClassName="ReactModal__Overlay_Custom"
        parentSelector={() => document.querySelector('main') ?? document.body}
        isOpen={showDeveloperNetwork}
        onRequestClose={() => {
          setShowDeveloperNetwork(false);
        }}
        ariaHideApp={false}
      >
        <div>
          <div className="hypertrons-crx-title">
            <span>{t('component_developerCollaborationNetwork_title')}</span>
            <div className="hypertrons-crx-title-extra developer-tab">
              {t('global_period')}: {REPO_PERIOD} {t('global_day')}
            </div>
          </div>
          <div className="d-flex flex-wrap justify-content-lg-between align-items-center">
            <div className="col-8 graph-container">
              <div style={{ margin: '15px 0 20px 0px' }}>
                <Graph data={developerNetwork} style={GRAPH_STYLE} focusedNodeID={currentDeveloper} />
              </div>
            </div>
            <div className="col-4 description-container">
              <div className="color-text-secondary developer-tab">
                <p>{t('component_developerCollaborationNetwork_description')}</p>
                <ul style={{ margin: '0px 0 10px 15px' }}>
                  <li>{t('component_developerCollaborationNetwork_description_node')}</li>
                  <li>{t('component_developerCollaborationNetwork_description_edge')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ReactModal>
      <ReactModal
        className="ReactModal__Content_Custom"
        overlayClassName="ReactModal__Overlay_Custom"
        parentSelector={() => document.querySelector('main') ?? document.body}
        isOpen={showRepoNetwork}
        onRequestClose={() => {
          setShowRepoNetwork(false);
        }}
        ariaHideApp={false}
      >
        <div>
          <div className="hypertrons-crx-title">
            <span>{t('component_mostParticipatedProjects_title')}</span>
            <div className="hypertrons-crx-title-extra">
              {t('global_period')}: {DEVELOPER_PERIOD} {t('global_day')}
            </div>
          </div>
          <div className="d-flex flex-wrap justify-content-lg-between align-items-center">
            <div className="col-lg-8 col-12 graph-container">
              <div style={{ margin: '15px 0px 20px 0px' }}>
                <Graph data={repoNetwork} style={GRAPH_STYLE} />
              </div>
            </div>
            <div className="col-lg-4 col-12 description-container">
              <div className="color-text-secondary">
                <p>{t('component_mostParticipatedProjects_description')}</p>
                <ul style={{ margin: '0px 0 10px 15px' }}>
                  <li>{t('component_mostParticipatedProjects_description_node')}</li>
                  <li>{t('component_mostParticipatedProjects_description_edge')}</li>
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
