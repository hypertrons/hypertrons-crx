import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Stack, Separator, DetailsList, SelectionMode } from 'office-ui-fabric-react';

interface GraphWithListProps {
  layout: NetworkLayoutType;
  title: string;
  graphData: NetworkData;
  onChartClick?: any;
  columns: any;
  listData: any;
}

const GraphWithList: React.FC<GraphWithListProps> = ({
  layout = 'force',
  title,
  graphData,
  columns,
  listData,
  onChartClick = (param: any, echarts: any) => {
    const url = 'https://github.com/' + param.data.name;
    window.location.href = url;
  }
}) => {
  const options = {
    tooltip: {},
    series: [
      {
        type: 'graph',
        layout: layout,
        nodes: graphData.nodes,
        edges: graphData.edges,
        draggable: true,
        roam: true,
        label: {
          position: 'right'
        },
        force: {
          repulsion: 150,
          edgeLength: 150
        },
        zoom: 0.9,
      }
    ]
  };

  return (
    <div className="hypertrons-crx-border hypertrons-crx-container">
      <p className="hypertrons-crx-title">{title}</p>
      <Stack horizontal>
        <Stack.Item className='verticalStackItemStyle'>
          <DetailsList
            items={listData}
            columns={columns}
            selectionMode={SelectionMode.none}
          />
        </Stack.Item>
        <Stack.Item className='verticalSeparatorStyle'>
          <Separator vertical />
        </Stack.Item>
        <Stack.Item className='verticalStackItemStyle'>
          <ReactECharts
            option={options}
            onEvents={{
              'click': onChartClick,
            }}
            style={{ height: '332px', width: '100%' }}
          />
        </Stack.Item>
      </Stack>
    </div>
  )
};

export default GraphWithList;