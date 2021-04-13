import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { Stack, Separator, DetailsList, SelectionMode, Link } from 'office-ui-fabric-react';
import { utils } from 'github-url-detection';
import ForceNetwork from '../../components/Network/ForceNetwork';
import ErrorPage from '../../components/ExceptionPage/index';
import { isPerceptor } from '../../utils/utils';
import { getGraphData } from '../../api/index';
import { getMessageI18n } from '../../utils/utils';
import PerceptorBase from './PerceptorBase';

const onProjectChartClick = (param: any, echarts: any) => {
  const url = 'https://github.com/' + param.data.name + '/pulse?type=perceptor';
  window.location.href = url;
};

interface ProjectNetworkViewProps {
  id: string;
  title: string;
  data: any;
  onChartClick?: any;
}
const ProjectNetworkView: React.FC<ProjectNetworkViewProps> = ({ id, title, data, onChartClick }) => {
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
      <p className="hypertrons-crx-title">{title}</p>
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

export default class ProjectNetwork extends PerceptorBase {
  constructor() {
    super();
    this.include = [
      isPerceptor
    ];
  }
  public async run(): Promise<void> {
    const perceptorContainer = $('#perceptor-layout').children();
    const ProjectNetworkDiv = document.createElement('div');
    ProjectNetworkDiv.id = 'project-network';
    ProjectNetworkDiv.style.width = "100%";
    try {
      const projectGraphData = await getGraphData(`https://hypertrons.oss-cn-shanghai.aliyuncs.com/repo/${utils.getRepositoryInfo(window.location)!.nameWithOwner}.json`);
      render(
        < ProjectNetworkView
          id='project'
          data={projectGraphData}
          title={getMessageI18n('component_mostParticipatedProjects_title')}
          onChartClick={onProjectChartClick}
        />,
        ProjectNetworkDiv,
      );
    } catch (error) {
      this.logger.error('projectNetwork', error);
      render(
        <ErrorPage />,
        ProjectNetworkDiv,
      );
    }

    perceptorContainer.prepend(ProjectNetworkDiv);
  }
}