import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import * as pageDetect from 'github-url-detection';
import { Stack, Separator, DetailsList, SelectionMode, Link } from 'office-ui-fabric-react';
import features from '.';
import ForceNetwork from '../../../components/Network/ForceNetwork';
import { getGraphData } from '../../../api/index';
import { getMessageI18n } from '../../../utils/utils';

import './developer-network.css';

interface DeveloperNetworkProps {
  id: string;
  title: string;
  data: any;
}
const DeveloperNetwork: React.FC<DeveloperNetworkProps> = ({ id, title, data }) => {
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
  const developerLogin = $('.p-nickname.vcard-username.d-block').text().trim();
  const developerGraphData = await getGraphData(`https://hypertrons.oss-cn-shanghai.aliyuncs.com/actor/${developerLogin}.json`);

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