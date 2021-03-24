import React from 'react';
import ReactECharts from 'echarts-for-react';

interface ForceNetworkProps {
  title: string;
  data: any;
  onChartClick?: any;
}

const ForceNetwork: React.FC<ForceNetworkProps> = ({
  title,
  data,
  onChartClick = (param: any, echarts: any) => {
    const url = 'https://github.com/' + param.data.name;
    window.location.href = url;
  }
}) => {
  const options = {
    title: {
      text: title,
      textStyle: {
        fontSize: 14,
        fontWeight: 400,
      },
    },
    tooltip: {},
    series: [
      {
        type: 'graph',
        layout: 'force',
        nodes: data.nodes,
        edges: data.edges,
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
    <ReactECharts
      option={options}
      onEvents={{
        'click': onChartClick,
      }}
      style={{ height: '300px', width: '100%' }}
    />
  )
};

export default ForceNetwork;