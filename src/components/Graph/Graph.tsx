import React, { useState, CSSProperties } from 'react';
import EChartsWrapper from './Echarts/index';
import GraphinWrapper from './Graphin/index'
import { Stack, Toggle, SwatchColorPicker } from 'office-ui-fabric-react';
import { getMessageI18n, GraphType, getGithubTheme, isNull } from "../../utils/utils"

enum ThemeType {
  light = 'light',
  dark = 'dark'
}

const GITHUB_THEME = getGithubTheme();

interface GraphProps {
  /**
   * data
   */
  readonly data: IGraphData;
  /**
   * graphType, default is Echarts
   */
  readonly graphType?: string;
  /**
   * `style` for graph container
   */
  readonly style?: CSSProperties;
  /**
   * callback function when click node
   */
  readonly onNodeClick?: NodeClickFunc;
}

const Graph: React.FC<GraphProps> = ({
  data,
  graphType = GraphType.echarts,
  style = {},
  onNodeClick = (node: INode) => {
    const url = 'https://github.com/' + node.id;
    window.location.href = url;
  },
}) => {
  const [theme, setTheme] = useState<any>(GITHUB_THEME);
  const NODE_SIZE = [5, 7, 10, 14, 18, 23];
  const NODE_COLOR = theme === ThemeType.light ? ['#9EB9A8', '#40C463', '#30A14E', '#216E39'] : ['#0E4429', '#006D32', '#26A641', '#39D353'];
  const THRESHOLD = [10, 40, 160, 640, 2560];

  const getSizeMap = (value: number): number => {
    const length = Math.min(THRESHOLD.length, NODE_SIZE.length - 1);
    let i = 0;
    for (; i < length; i++) {
      if (value < THRESHOLD[i]) {
        return NODE_SIZE[i];
      }
    }
    return NODE_SIZE[i];
  }

  const getColorMap = (value: number): string => {
    const length = Math.min(THRESHOLD.length, NODE_COLOR.length - 1);
    let i = 0;
    for (; i < length; i++) {
      if (value < THRESHOLD[i]) {
        return NODE_COLOR[i];
      }
    }
    return NODE_COLOR[i];
  }
  const generateEchartsData = (data: any): any => {
    const generateNodes = (nodes: any[]): any => {
      return nodes.map((n: any) => {
        return {
          name: n.name,
          value: n.value,
          symbolSize: getSizeMap(n.value),
          itemStyle: {
            color: getColorMap(n.value)
          }
        }
      })
    }
    const generateEdges = (edges: any[]): any => {
      return edges.map((e: any) => {
        return {
          source: e.source,
          target: e.target,
          value: e.weight
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
        const color = getColorMap(n.value);
        return {
          id: n.name,
          value: n.value,
          style: {
            keyshape: {
              size: getSizeMap(n.value),
              stroke: color,
              fill: color,
              fillOpacity: 1,
            },
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
          style: {
            keyshape: {
              type: 'poly',
              poly: {
                distance: 40,
              },
            },
          },
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
              edgeLength: [1, 150],
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

  const colorCellsExample1 = [
    { id: 'L0', label: `< ${THRESHOLD[0]}`, color: NODE_COLOR[0] },
    { id: 'L1', label: `${THRESHOLD[0]} - ${THRESHOLD[1]}`, color: NODE_COLOR[1] },
    { id: 'L2', label: `${THRESHOLD[1]} - ${THRESHOLD[2]}`, color: NODE_COLOR[2] },
    { id: 'L3', label: `> ${THRESHOLD[2]}`, color: NODE_COLOR[3] },
  ];

  if (isNull(data)) {
    return (<div />)
  }
  return (
    <Stack>
      <Stack
        horizontal
        horizontalAlign="space-between"
        style={{ padding: "3px" }}
        tokens={{
          childrenGap: 10
        }}
      >
        <Toggle
          defaultChecked={theme === ThemeType.dark}
          // Note: Graphin is currently unable to switch the theme. See: https://graphin.antv.vision/en-US/graphin/render/theme/
          disabled={graphType === GraphType.antv}
          onText={getMessageI18n("component_darkMode")}
          offText={getMessageI18n("component_darkMode")}
          onChange={(e, checked) => {
            checked ? setTheme(ThemeType.dark) : setTheme(ThemeType.light);
          }}
        />
        <Stack
          horizontal
          horizontalAlign="space-between"
        >
          <span>Less</span>
          <div style={{ marginTop: "-12px", maxWidth: '80px' }}>
            <SwatchColorPicker
              columnCount={4}
              cellShape={'square'}
              cellHeight={10}
              cellWidth={10}
              colorCells={colorCellsExample1} />
          </div>
          <span>More</span>
        </Stack>
      </Stack>
      <Stack className='hypertrons-crx-border'>
        {
          graphType === GraphType.echarts &&
          <EChartsWrapper
            option={graphOption}
            onEvents={{
              'click': onNodeClick,
            }}
            style={style}
            theme={theme}
          />
        }
        {
          graphType === GraphType.antv &&
          <GraphinWrapper
            data={graphData}
            style={style}
            theme={theme}
            onNodeClick={onNodeClick}
          />
        }
      </Stack>
    </Stack>
  )
};

export default Graph;