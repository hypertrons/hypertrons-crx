import React from 'react';
import ReactECharts from 'echarts-for-react';
import { fastLerp, stringify } from '../../utils/color';
import Graphin, { Utils } from '@antv/graphin';
import { Stack, Separator } from 'office-ui-fabric-react';
import { GraphType } from "../../utils/utils"
import { linearMap } from '../../utils/number';

export interface VisualMapOption {
  node: {
    min: number,
    max: number,
    symbolSize: [number, number]
  },
  edge: {
    min: number,
    max: number,
    width: [number, number]
  }
}

interface GraphProps {
  title: string;
  graphType: string;
  data: NetworkData;
  visualMapOption?: VisualMapOption;
  onChartClick?: any;
}

const Graph: React.FC<GraphProps> = ({
  title,
  graphType,
  data,
  visualMapOption = {
    node: {
      min: 0,
      max: 500,
      symbolSize: [5, 10]
    },
    edge: {
      min: 0,
      max: 20,
      width: [1, 3]
    }
  },
  onChartClick = (param: any, echarts: any) => {
    const url = 'https://github.com/' + param.data.name;
    window.location.href = url;
  },
}) => {

  const generateEchartsData = (data: any): any => {
    const generateNodes = (nodes: any[]): any => {
      return nodes.map((n: any) => {
        return {
          name: n.name,
          value: n.value,
          symbolSize: linearMap(n.value, [visualMapOption.node.min, visualMapOption.node.max], visualMapOption.node.symbolSize),
          itemStyle: {
            color: stringify(
              fastLerp(
                linearMap(n.value, [visualMapOption.node.min, visualMapOption.node.max], [0, 1]),
                [[33, 110, 57, 1], [165, 42, 42, 1]]
              ),
              'rgba'
            )
          }
        }
      })
    }
    const generateEdges = (edges: any[]): any => {
      return edges.map((e: any) => {
        return {
          source: e.source,
          target: e.target,
          value: e.weight,
          lineStyle: {
            width: linearMap(e.weight, [visualMapOption.edge.min, visualMapOption.edge.max], visualMapOption.edge.width),
          }
        }
      })
    }
    return {
      nodes: generateNodes(data.nodes),
      edges: generateEdges(data.edges)
    }
  }

  const generateGraphinData = (data: any): any => {
    const generateNodes = (nodes: any[]): any => {
      return nodes.map((n: any) => {
        return {
          id: n.name,
          type: "graphin-circle",
          style: {
            label: {
              value: n.name
            },
            badges: [
              {
                position: 'RT',
                type: 'text',
                value: n.value.toFixed(2),
                size: [20, 20],
                color: '#000'
              },
            ],
          }
        }
      })
    }
    const generateEdges = (edges: any[]): any => {
      return edges.map((e: any) => {
        return {
          source: e.source,
          target: e.target,
        }
      })
    }
    return {
      nodes: generateNodes(data.nodes),
      edges: generateEdges(data.edges)
    }
  }

  let graphData: any;
  let graphOption: any;
  switch (graphType) {
    case GraphType.echarts:
      graphData = generateEchartsData(data);
      graphOption = {
        tooltip: {},
        series: [
          {
            type: 'graph',
            layout: 'force',
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
            lineStyle: {
              curveness: 0.2,
              opacity: 0.7
            }
          }
        ]
      };
      break;
    case GraphType.antv:
      graphData = generateGraphinData(data);
      break;
    default:
      break;
  }

  return (
    <div className="hypertrons-crx-border hypertrons-crx-container">
      <p className="hypertrons-crx-title">{title}</p>
      <Stack horizontal>

        <Stack.Item className='verticalStackItemStyle'>
          {
            graphType === GraphType.echarts &&
            <ReactECharts
              option={graphOption}
              onEvents={{
                'click': onChartClick,
              }}
              style={{
                height: '332px',
                width: '100%'
              }}
            />
          }
          {
            graphType === GraphType.antv &&
            <div
              style={{
                width: '100%',
                overflow: 'hidden',
                height: '332px'
              }}
            >
              <Graphin
                data={graphData}
              >
              </Graphin>
            </div>
          }
        </Stack.Item>
        <Stack.Item className='verticalSeparatorStyle'>
          <Separator vertical />
        </Stack.Item>
        <Stack.Item className='verticalStackItemStyle'>
        </Stack.Item>
      </Stack>
    </div>
  )
};

export default Graph;