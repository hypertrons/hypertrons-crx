import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import features from '.';
import ForceNetwork from '../../../components/Network/ForceNetwork';
import { isPerceptor } from '../../../utils/utils';
import { developerData } from '../mock/developer.data';
import { projectData } from '../mock/project.data';
import { getMessageI18n } from '../../../utils/utils'

export const getDeveloperData = async () => {
  // const url = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/data/les-miserables.json';
  // const response = await fetch(url);
  // const data = await response.json();
  const data = developerData;
  const developerLogin = 'testDeveloperLogin';
  data.nodes.forEach((node: any) => {
    node['symbolSize'] = node.value;
    if (node.name === developerLogin) {
      node['itemStyle'] = {
        color: 'green'
      };
    }
  });
  data.edges.forEach((edge: any) => {
    edge['lineStyle'] = {
      width: edge.weight
    };
    edge['value'] = edge.weight;
  });
  return data;
}

export const getProjectData = async () => {
  // const url = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/data/les-miserables.json';
  // const response = await fetch(url);
  // const data = await response.json();
  const data = projectData;
  data.nodes.forEach((node: any) => {
    node['symbolSize'] = node.value;
  });
  data.edges.forEach((edge: any) => {
    edge['lineStyle'] = {
      width: edge.weight
    };
    edge['value'] = edge.weight;
  });
  return data;
}

export const onChartClick = (param: any, echarts: any) => {
  const url = 'https://github.com/' + param.data.name + '/settings?type=perceptor';
  window.location.href = url;
};

const init = async (): Promise<void | false> => {

  const perceptorContainer = $('#perceptor-layout').children();
  const ProjectNetworkDiv = document.createElement('div');
  ProjectNetworkDiv.id = 'project-network';
  ProjectNetworkDiv.style.width = "100%";

  const developerData = await getDeveloperData();
  const projectData = await getProjectData();

  render(
    <div className="hypertrons-crx-border mt-4">
      <div style={{ width: '50%', display: 'inline-block' }}>
        <ForceNetwork
          title={getMessageI18n('component_developerCollabrationNetwork_title')}
          data={developerData}
        />
      </div>
      <div style={{ width: '50%', display: 'inline-block' }}>
        <ForceNetwork
          title={getMessageI18n('component_projectCorrelationNetwork_title')}
          data={projectData}
          onChartClick={onChartClick}
        />
      </div>
    </div>,
    ProjectNetworkDiv,
  );
  perceptorContainer.prepend(ProjectNetworkDiv);
}

void features.add('project-network', {
  include: [
    isPerceptor
  ],
  init
});