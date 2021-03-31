import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import { Stack, Separator, DetailsList, SelectionMode, Link } from 'office-ui-fabric-react';
import features from '.';
import ForceNetwork from '../../../components/Network/ForceNetwork';
import { getMessageI18n, getGraphData } from '../../../utils/utils'
import './developer-network.css';

const onProjectChartClick = (param: any, echarts: any) => {
  const url = 'https://github.com/' + param.data.name + '/pulse?type=perceptor';
  window.location.href = url;
};

interface DeveloperNetworkProps {
  id: string;
  title: string;
  data: any;
  onChartClick?: any;
}
const DeveloperNetwork: React.FC<DeveloperNetworkProps> = ({ id, title, data, onChartClick }) => {
  const list = data.nodes.slice(0, 5);
  const columns = [
    {
      key: 'column1',
      name: getMessageI18n(`global_${id}`),
      fieldName: 'name',
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => (
        <Link href={'https://github.com/' + item.name} >
          {item.name}
        </Link>
      ),
    },
    { key: 'column2', name: getMessageI18n('global_activity'), fieldName: 'value', minWidth: 100, maxWidth: 200, isResizable: true },
  ];
  return (
    <div className="hypertrons-crx-border mt-4">
      <h3>{title}</h3>
      <Stack horizontal>
        <Stack.Item className='verticalStackItemStyle'>
          <DetailsList
            items={list}
            columns={columns}
            selectionMode={SelectionMode.none}
          />
        </Stack.Item>
        <Stack.Item className='verticalSeparatorStyle'>
          <Separator vertical />
        </Stack.Item>
        <Stack.Item className='verticalStackItemStyle'>
          <ForceNetwork
            data={data}
            onChartClick={onChartClick}
          />
        </Stack.Item>
      </Stack>
    </div>
  )
};

const init = async (): Promise<void | false> => {
  const pinnedReposDiv = $('.js-pinned-items-reorder-container').parent();
  const DeveloperNetworkDiv = document.createElement('div');
  DeveloperNetworkDiv.id = 'developer-network';
  DeveloperNetworkDiv.style.width = "100%";
  const developerGraphData = await getGraphData('https://hypertrons.oss-cn-shanghai.aliyuncs.com/actor/GulajavaMinistudio.json');
  const projectGraphData = await getGraphData('https://hypertrons.oss-cn-shanghai.aliyuncs.com/repo/kubernetes/kubernetes.json');

  const developerLogin = $('.p-nickname.vcard-username.d-block').text().trim();
  developerGraphData.nodes.forEach((node: any) => {
    if (node.name === developerLogin) {
      node['itemStyle'] = {
        color: '#fb8532'
      };
    }
  });

  render(
    <div>
      < DeveloperNetwork
        id='developer'
        data={developerGraphData}
        title={getMessageI18n('component_developerCollabrationNetwork_title')}
      />
      < DeveloperNetwork
        id='project'
        data={projectGraphData}
        title={getMessageI18n('component_mostParticipatedProjects_title')}
        onChartClick={onProjectChartClick}
      />
    </div>,
    DeveloperNetworkDiv,
  );
  pinnedReposDiv.before(DeveloperNetworkDiv);
}

void features.add('developerNetwork', {
  include: [
    pageDetect.isUserProfileMainTab
  ],
  init
});