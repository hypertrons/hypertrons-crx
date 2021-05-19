import React, { useState, CSSProperties } from 'react';
import EChartsWrapper from './Echarts/index';
import { fastLerp, stringify } from '../../utils/color';
import Graphin from '@antv/graphin';
import { Stack, Toggle } from 'office-ui-fabric-react';
import { getMessageI18n, GraphType } from "../../utils/utils"
import { linearMap } from '../../utils/number';

enum ThemeType {
  light = 'light',
  dark = 'dark'
}
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
  graphType: string;
  data: NetworkData;
  visualMapOption?: VisualMapOption;
  style?: CSSProperties;
  onChartClick?: any;
}

const Graph: React.FC<GraphProps> = ({
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
  style,
  onChartClick = (param: any, echarts: any) => {
    const url = 'https://github.com/' + param.data.name;
    window.location.href = url;
  },
}) => {

  const [theme, setTheme] = useState(ThemeType.light);

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
        animation: true,
        animationDuration: 3000,
        series: [
          {
            type: 'graph',
            layout: 'force',
            nodes: graphData.nodes,
            edges: graphData.edges,
            // Enable mouse zooming and translating. See: https://echarts.apache.org/en/option.html#series-graph.roam
            roam: true,
            label: {
              position: 'right'
            },
            force: {
              repulsion: 50,
              edgeLength: [1, 100],
              // Disable the iteration animation of layout. See: https://echarts.apache.org/en/option.html#series-graph.force.layoutAnimation
              layoutAnimation: false,
            },
            lineStyle: {
              curveness: 0.3,
              opacity: 0.7
            },
            emphasis: {
              focus: 'adjacency',
              label: {
                position: 'right',
                show: true
              }
            },
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
    <Stack>
      <Stack
        horizontal
        style={{ margin: "5px", padding: "3px" }}
        tokens={{
          childrenGap: 10
        }}
      >
        <Toggle
          defaultChecked={theme === ThemeType.dark}
          onText={getMessageI18n("component_darkMode")}
          offText={getMessageI18n("component_darkMode")}
          onChange={(e, checked) => {
            checked ? setTheme(ThemeType.dark) : setTheme(ThemeType.light);
          }}
        />
      </Stack>
      <Stack className='hypertrons-crx-border'>
        {
          graphType === GraphType.echarts &&
          <EChartsWrapper
            option={graphOption}
            onEvents={{
              'click': onChartClick,
            }}
            theme={theme}
            style={style}
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
      </Stack>
    </Stack>
  )
};

export default Graph;