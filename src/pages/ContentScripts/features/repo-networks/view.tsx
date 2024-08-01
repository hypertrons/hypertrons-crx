import React, { useState, useEffect } from 'react';
import { Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

import Graph from '../../../../components/Graph';
import Table from '../../../../components/Table';
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
  const [adjacentNodes, setAdjacentNodes] = useState<[string, number][]>([]);
  const [developerAdjacentNodes, setDeveloperAdjacentNodes] = useState<[string, number][]>([]);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    (async function () {
      setOptions(await optionsStorage.getAll());
      i18n.changeLanguage(options.locale);
    })();
  }, [options.locale]);

  useEffect(() => {
    const newAdjacentNodes: [string, number][] = [];
    repoNetwork.edges.forEach((edge: [string, string, number]) => {
      if (edge[0] === currentRepo && edge[2] >= 10) {
        newAdjacentNodes.push([edge[1], edge[2]]);
      } else if (edge[1] === currentRepo && edge[2] >= 10) {
        newAdjacentNodes.push([edge[0], edge[2]]);
      }
    });
    setAdjacentNodes(newAdjacentNodes);
    if (developerNetwork.nodes.length > 0) {
      console.log(developerNetwork);
      const firstDeveloper = developerNetwork.nodes[0][0];
      const newDeveloperAdjacentNodes: [string, number][] = [];
      developerNetwork.edges.forEach((edge: [string, string, number]) => {
        if (edge[0] === firstDeveloper && edge[2] >= 2.5) {
          newDeveloperAdjacentNodes.push([edge[1], edge[2]]);
        } else if (edge[1] === firstDeveloper && edge[2] >= 2.5) {
          newDeveloperAdjacentNodes.push([edge[0], edge[2]]);
        }
      });
      setDeveloperAdjacentNodes(newDeveloperAdjacentNodes);
    }
  }, [currentRepo, repoNetwork.edges, developerNetwork.nodes, developerNetwork.edges]);

  const onProjectNetworkNodeToolTipChange = (nodeData: any) => {
    const newAdjacentNodes: [string, number][] = [];
    if (nodeData.includes('/')) {
      repoNetwork.edges.forEach((edge: [string, string, number]) => {
        if (edge[0] === nodeData && edge[2] >= 10) {
          newAdjacentNodes.push([edge[1], edge[2]]);
        } else if (edge[1] === nodeData && edge[2] >= 10) {
          newAdjacentNodes.push([edge[0], edge[2]]);
        }
      });
    }
    setAdjacentNodes(newAdjacentNodes);
  };

  const onDeveloperNetworkNodeToolTipChange = (nodeData: any) => {
    const newAdjacentNodes: [string, number][] = [];
    developerNetwork.edges.forEach((edge: [string, string, number]) => {
      if (edge[0] === nodeData && edge[2] >= 2.5) {
        newAdjacentNodes.push([edge[1], edge[2]]);
      } else if (edge[1] === nodeData && edge[2] >= 2.5) {
        newAdjacentNodes.push([edge[0], edge[2]]);
      }
    });
    setDeveloperAdjacentNodes(newAdjacentNodes);
  };

  return (
    <div>
      <div className="hypertrons-crx-border hypertrons-crx-container">
        <div className="hypertrons-crx-title">
          <span>{t('component_projectCorrelationNetwork_title')}</span>
          <Popover
            content={
              <div className="color-text-secondary">
                <p>{t('component_projectCorrelationNetwork_description')}</p>
                <ul style={{ margin: '0px 0 10px 15px' }}>
                  <li>{t('component_projectCorrelationNetwork_description_node')}</li>
                  <li>{t('component_projectCorrelationNetwork_description_edge')}</li>
                </ul>
              </div>
            }
            overlayStyle={{ width: '500px' }}
          >
            <InfoCircleOutlined style={{ marginLeft: '10px' }} />
          </Popover>
          <div className="hypertrons-crx-title-extra">
            {t('global_period')}: {REPO_PERIOD} {t('global_day', { count: REPO_PERIOD })}
          </div>
        </div>
        <div className="d-flex flex-wrap flex-items-center">
          <div className="col-12 col-md-8">
            <div style={{ margin: '10px 0 20px 20px' }}>
              <Graph
                data={repoNetwork}
                style={graphStyle}
                focusedNodeID={currentRepo}
                onToolTipChange={onProjectNetworkNodeToolTipChange}
              />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <Table adjacentNodes={adjacentNodes} />
          </div>
        </div>
      </div>
      <div className="hypertrons-crx-border hypertrons-crx-container">
        <div className="hypertrons-crx-title">
          <span>{t('component_activeDeveloperCollaborationNetwork_title')}</span>
          <Popover
            content={
              <div className="color-text-secondary">
                <p>{t('component_activeDeveloperCollaborationNetwork_description')}</p>
                <ul style={{ margin: '0px 0 10px 15px' }}>
                  <li>{t('component_activeDeveloperCollaborationNetwork_description_node')}</li>
                  <li>{t('component_activeDeveloperCollaborationNetwork_description_edge')}</li>
                </ul>
              </div>
            }
            overlayStyle={{ width: '500px' }}
          >
            <InfoCircleOutlined style={{ marginLeft: '10px' }} />
          </Popover>
          <div className="hypertrons-crx-title-extra">
            {t('global_period')}: {DEVELOPER_PERIOD} {t('global_day', { count: REPO_PERIOD })}
          </div>
        </div>
        <div className="d-flex flex-wrap flex-items-center">
          <div className="col-12 col-md-8">
            <div style={{ margin: '10px 0 20px 20px' }}>
              <Graph data={developerNetwork} style={graphStyle} onToolTipChange={onDeveloperNetworkNodeToolTipChange} />
            </div>
          </div>
          <div className="col-12 col-md-4">
            <Table adjacentNodes={developerAdjacentNodes} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
