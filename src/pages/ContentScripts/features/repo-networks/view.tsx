import React, { useState, useEffect } from 'react';

import Graph from '../../../../components/Graph';
import getMessageByLocale from '../../../../helpers/get-message-by-locale';
import optionsStorage, { HypercrxOptions, defaults } from '../../../../options-storage';

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

  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
    })();
  }, []);

  return (
    <div>
      <div className="hypertrons-crx-border hypertrons-crx-container">
        <div className="hypertrons-crx-title">
          <span>{getMessageByLocale('component_projectCorrelationNetwork_title', options.locale)}</span>
          <div className="hypertrons-crx-title-extra">
            {getMessageByLocale('global_period', options.locale)}: {REPO_PERIOD}{' '}
            {getMessageByLocale('global_day', options.locale)}
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
              <p>{getMessageByLocale('component_projectCorrelationNetwork_description', options.locale)}</p>
              <ul style={{ margin: '0px 0 10px 15px' }}>
                <li>{getMessageByLocale('component_projectCorrelationNetwork_description_node', options.locale)}</li>
                <li>{getMessageByLocale('component_projectCorrelationNetwork_description_edge', options.locale)}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="hypertrons-crx-border hypertrons-crx-container">
        <div className="hypertrons-crx-title">
          <span>{getMessageByLocale('component_activeDeveloperCollaborationNetwork_title', options.locale)}</span>
          <div className="hypertrons-crx-title-extra">
            {getMessageByLocale('global_period', options.locale)}: {DEVELOPER_PERIOD}{' '}
            {getMessageByLocale('global_day', options.locale)}
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
              <p>{getMessageByLocale('component_activeDeveloperCollaborationNetwork_description', options.locale)}</p>
              <ul style={{ margin: '0px 0 10px 15px' }}>
                <li>
                  {getMessageByLocale('component_activeDeveloperCollaborationNetwork_description_node', options.locale)}
                </li>
                <li>
                  {getMessageByLocale('component_activeDeveloperCollaborationNetwork_description_edge', options.locale)}
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
