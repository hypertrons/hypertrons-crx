import React from 'react';
import ReactECharts from 'echarts-for-react';
import './index.css';
import { NpmDepGraphData } from './sample.data';

interface DeveloperCollabrationNetworkProps {
  props: {
    developerLogin: string
  }
}

const DeveloperCollabrationNetwork: React.FC<DeveloperCollabrationNetworkProps> = ({
  props: {
    developerLogin = 'fakeDeveloperLogin'
  }
}) => {

  const options = {
    title: {
      text: 'Developer Collaboration Network'
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [{
      type: 'graph',
      layout: 'none',
      // progressiveThreshold: 700,
      data: NpmDepGraphData.nodes.map(function (node: any) {
        return {
          x: node.x,
          y: node.y,
          id: node.id,
          name: node.label,
          symbolSize: node.size,
          itemStyle: {
            color: node.color
          }
        };
      }),
      edges: NpmDepGraphData.edges.map(function (edge: any) {
        return {
          source: edge.sourceID,
          target: edge.targetID
        };
      }),
      emphasis: {
        focus: 'adjacency',
        label: {
          position: 'right',
          show: true
        }
      },
      roam: true,
      lineStyle: {
        width: 0.5,
        curveness: 0.3,
        opacity: 0.7
      }
    }]
  };

  console.log(developerLogin);

  return (
    <div className="hypertrons-crx-border mt-4">
      <ReactECharts option={options} />
    </div>
  );
};

export default DeveloperCollabrationNetwork;