import React, { useState, useEffect } from 'react';

import Graph from '../../../../components/Graph';
// import getMessageByLocale from '../../../../helpers/get-message-by-locale';
import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';
import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';
const DEVELOPER_PERIOD = 90;
const REPO_PERIOD = 90;

interface Props {
  currentRepo: string;
  repoNetwork: any;
  developerNetwork: any;
}

const graphStyle = {
  width: '100%',
  height: '380px',
};

const View = ({ currentRepo, repoNetwork, developerNetwork }: Props): JSX.Element => {
  const [options, setOptions] = useState<HypercrxOptions>(defaults);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
      i18n.changeLanguage(options.locale);
    })();
  }, [options.locale]);

  return (
    <div>
      <div className="hypertrons-crx-border hypertrons-crx-container">
        <div className="hypertrons-crx-title">
          <span>{t('component_projectCorrelationNetwork_title')}</span>
          <div className="hypertrons-crx-title-extra">
            {t('global_period')}: {REPO_PERIOD}{' '}
            {t('global_day')}
          </div>
        </div>
        <div className="d-flex flex-wrap flex-items-center">
          <div className="col-12 col-md-8">
            <div style={{ margin: '10px 0 20px 20px' }}>
              <Graph data={repoNetwork} style={graphStyle} focusedNodeID={currentRepo} />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="color-text-secondary" style={{ marginLeft: '35px', marginRight: '35px' }}>
              <p>{t('component_projectCorrelationNetwork_description')}</p>
              <ul style={{ margin: '0px 0 10px 15px' }}>
                <li>{t('component_projectCorrelationNetwork_description_node')}</li>
                <li>{t('component_projectCorrelationNetwork_description_edge')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="hypertrons-crx-border hypertrons-crx-container">
        <div className="hypertrons-crx-title">
          <span>{t('component_activeDeveloperCollaborationNetwork_title')}</span>
          <div className="hypertrons-crx-title-extra">
            {t('global_period')}: {DEVELOPER_PERIOD}{' '}
            {t('global_day')}
          </div>
        </div>
        <div className="d-flex flex-wrap flex-items-center">
          <div className="col-12 col-md-8">
            <div style={{ margin: '10px 0 20px 20px' }}>
              <Graph data={developerNetwork} style={graphStyle} />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className="color-text-secondary" style={{ marginLeft: '35px', marginRight: '35px' }}>
              <p>{t('component_activeDeveloperCollaborationNetwork_description')}</p>
              <ul style={{ margin: '0px 0 10px 15px' }}>
                <li>
                  {t('component_activeDeveloperCollaborationNetwork_description_node')}
                </li>
                <li>
                  {t('component_activeDeveloperCollaborationNetwork_description_edge')}
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
