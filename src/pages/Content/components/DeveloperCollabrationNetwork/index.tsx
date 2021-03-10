import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { developerCollabrationData, projectData } from './sample.data'
import './index.css';

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
  const [developerOption, setDeveloperOption] = useState<any>(null);
  const [projectOption, setProjectOption] = useState<any>(null);

  useEffect(() => {
    const getDeveloperData = async () => {
      try {
        // const url = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/asset/data/les-miserables.json';
        // const response = await fetch(url);
        // const data = await response.json();
        const data = developerCollabrationData;
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
        const options = {
          title: {
            text: 'Developer Collabration Network',
            textStyle: {
              fontSize: 14,
              fontWeight: 400,
            },
            x: 'center'
          },
          tooltip: {},
          series: [
            {
              type: 'graph',
              layout: 'force',
              nodes: data.nodes,
              edges: data.edges,
              roam: true,
              label: {
                position: 'right'
              },
              force: {
                repulsion: 150,
                edgeLength: 150
              },
              // tooltip: {
              //   formatter: 'activeness: {c}'
              // },
              zoom: 0.9,
              // top: '30%'
            }
          ]
        };
        setDeveloperOption(options);
      } catch (error) {
        console.log(error);
      }
    };

    const getProjectData = async () => {
      try {
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
        const options = {
          title: {
            text: '10 most participated projects',
            textStyle: {
              fontSize: 14,
              fontWeight: 400,
            },
            x: 'center'
          },
          tooltip: {},
          series: [
            {
              type: 'graph',
              layout: 'circular',
              nodes: data.nodes,
              edges: data.edges,
              roam: true,
              label: {
                position: 'right'
              },
              // tooltip: {
              //   formatter: 'activeness: {c}'
              // },
              zoom: 0.9,
              // top: '10%'
            }
          ]
        };
        setProjectOption(options);
      } catch (error) {
        console.log(error);
      }
    }
    getDeveloperData();
    getProjectData();
  }, [developerLogin]);

  const onChartClick = (param: any, echarts: any) => {
    const url = 'https://github.com/' + param.data.name;
    window.location.href = url;
  };

  if (!developerOption || !projectOption) {
    return (
      <div></div>
    );
  }

  return (
    <div className="hypertrons-crx-border mt-4">
      <div style={{ width: '50%', display: 'inline-block' }}>
        <ReactECharts
          option={developerOption}
          onEvents={{
            'click': onChartClick,
          }}
        />
      </div>
      <div style={{ width: '50%', display: 'inline-block' }}>
        <ReactECharts
          option={projectOption}
          onEvents={{
            'click': onChartClick,
          }}
        />
      </div>
    </div>
  )
};

export default DeveloperCollabrationNetwork;