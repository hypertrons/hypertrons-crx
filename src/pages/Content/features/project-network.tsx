import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { Stack, Separator, DetailsList, SelectionMode, Link, Shimmer } from 'office-ui-fabric-react';
import features from '.';
import ForceNetwork from '../../../components/Network/ForceNetwork';
import ErrorPage from '../../../components/ExceptionPage/index';
import { isPerceptor } from '../../../utils/utils';
import { getGraphData } from '../../../api/index';
import { getMessageI18n } from '../../../utils/utils';
import './project-network.css';

const onProjectChartClick = (param: any, echarts: any) => {
  const url = 'https://github.com/' + param.data.name + '/pulse?type=perceptor';
  window.location.href = url;
};

interface ProjectNetworkProps {
  id: string;
  title: string;
  data: any;
  onChartClick?: any;
}
const ProjectNetwork: React.FC<ProjectNetworkProps> = ({ id, title, data, onChartClick }) => {
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

  const perceptorContainer = $('#perceptor-layout').children();
  const ProjectNetworkDiv = document.createElement('div');
  ProjectNetworkDiv.id = 'project-network';
  ProjectNetworkDiv.style.width = "100%";
  try {
    const projectGraphData = await getGraphData('https://hypertrons.oss-cn-shanghai.aliyuncs.com/repo/kubernetes/kubernetes.json');
    render(
      < ProjectNetwork
        id='project'
        data={projectGraphData}
        title={getMessageI18n('component_mostParticipatedProjects_title')}
        onChartClick={onProjectChartClick}
      />,
      ProjectNetworkDiv,
    );
  } catch (error) {
    features.error('projectNetwork', error);
    render(
      <ErrorPage />,
      ProjectNetworkDiv,
    );
  }

  perceptorContainer.prepend(ProjectNetworkDiv);
}

void features.add('projectNetwork', {
  include: [
    isPerceptor
  ],
  init
});