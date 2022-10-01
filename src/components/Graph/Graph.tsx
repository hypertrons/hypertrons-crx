import React, { useState, CSSProperties, useEffect } from 'react';
import EChartsWrapper from './Echarts/index';
import { Stack, SwatchColorPicker, Link } from 'office-ui-fabric-react';
import {
  getGithubTheme,
  isNull,
  getMinMax,
  linearMap,
  getMessageByLocale,
} from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';

const githubTheme = getGithubTheme();

interface GraphProps {
  /**
   * data
   */
  readonly data: IGraphData;
  /**
   * graphType, default is Echarts
   */
  readonly graphType?: GraphType;
  /**
   * `style` for graph container
   */
  readonly style?: CSSProperties;
  /**
   * callback function when click node
   */
  readonly onNodeClick?: NodeClickFunc;
  /**
   * will assign a distinguishable color to the focused node if specified
   */
  readonly focusedNodeID?: string;
}

const Graph: React.FC<GraphProps> = ({
  data,
  graphType = 'echarts',
  style = {},
  onNodeClick = (node: INode) => {
    const url = 'https://github.com/' + node.id;
    window.location.href = url;
  },
  focusedNodeID,
}) => {
  const NODE_SIZE = [10, 30];
  const NODE_COLOR =
    githubTheme === 'light'
      ? ['#9EB9A8', '#40C463', '#30A14E', '#216E39']
      : ['#0E4429', '#006D32', '#26A641', '#39D353'];
  const THRESHOLD = [10, 100, 1000];
  const FOCUSED_NODE_COLOR = githubTheme === 'light' ? '#D73A49' : '#DA3633';

  const [inited, setInited] = useState(false);
  const [settings, setSettings] = useState(new Settings());

  useEffect(() => {
    const initSettings = async () => {
      const temp = await loadSettings();
      setSettings(temp);
      setInited(true);
    };
    if (!inited) {
      initSettings();
    }
  }, [inited, settings]);

  const getColorMap = (value: number): string => {
    const length = Math.min(THRESHOLD.length, NODE_COLOR.length - 1);
    let i = 0;
    for (; i < length; i++) {
      if (value < THRESHOLD[i]) {
        return NODE_COLOR[i];
      }
    }
    return NODE_COLOR[i];
  };
  const generateEchartsData = (data: any): any => {
    const generateNodes = (nodes: any[]): any => {
      const minMax = getMinMax(nodes);
      return nodes.map((n: any) => {
        const imageURL =
          `image://https://avatars.githubusercontent.com/` + n.name;
        /* 
        Not to replace node color with profile picture in project correlation network
        checking weather nodes denotes repository
      */
        if (n.name.includes('/')) {
          return {
            id: n.name,
            name: n.name,
            value: n.value,
            symbolSize: linearMap(n.value, minMax, NODE_SIZE),
            itemStyle: {
              color:
                focusedNodeID && focusedNodeID === n.name
                  ? FOCUSED_NODE_COLOR
                  : getColorMap(n.value),
            },
          };
        } else {
          /* 
        nodes doesnot denote repositories
      */
          return {
            id: n.name,
            name: n.name,
            value: n.value,
            symbolSize: linearMap(n.value, minMax, NODE_SIZE),
            symbol: imageURL,
          };
        }
      });
    };
    const generateEdges = (edges: any[]): any => {
      return edges.map((e: any) => {
        return {
          source: e.source,
          target: e.target,
          value: e.weight,
        };
      });
    };
    return {
      nodes: generateNodes(data.nodes),
      edges: generateEdges(data.edges),
    };
  };

  let graphData: any;
  let graphOption: any;
  switch (graphType) {
    case 'echarts':
      graphData = generateEchartsData(data);
      graphOption = {
        tooltip: {},
        animation: true,
        animationDuration: 2000,
        series: [
          {
            type: 'graph',
            layout: 'force',
            nodes: graphData.nodes,
            edges: graphData.edges,
            // Enable mouse zooming and translating
            roam: true,
            label: {
              position: 'right',
            },
            force: {
              repulsion: 50,
              edgeLength: [1, 100],
              // Disable the iteration animation of layout
              layoutAnimation: false,
            },
            lineStyle: {
              curveness: 0.3,
              opacity: 0.7,
            },
            emphasis: {
              focus: 'adjacency',
              label: {
                position: 'right',
                show: true,
              },
            },
          },
        ],
      };
      break;
    default:
      break;
  }

  const colorCellsExample1 = [
    { id: 'L0', label: `< ${THRESHOLD[0]}`, color: NODE_COLOR[0] },
    {
      id: 'L1',
      label: `${THRESHOLD[0]} - ${THRESHOLD[1]}`,
      color: NODE_COLOR[1],
    },
    {
      id: 'L2',
      label: `${THRESHOLD[1]} - ${THRESHOLD[2]}`,
      color: NODE_COLOR[2],
    },
    { id: 'L3', label: `> ${THRESHOLD[2]}`, color: NODE_COLOR[3] },
  ];

  if (isNull(data)) {
    return <div />;
  }
  return (
    <Stack>
      <Stack className="hypertrons-crx-border">
        {graphType === 'echarts' && (
          <EChartsWrapper
            option={graphOption}
            style={style}
            onEvents={{
              click: onNodeClick,
            }}
          />
        )}
      </Stack>
      <Stack
        horizontal
        horizontalAlign="space-between"
        style={{ padding: '3px' }}
        tokens={{
          childrenGap: 10,
        }}
      >
        <Link
          href={getMessageByLocale(
            'component_activity_definition_link',
            settings.locale
          )}
          target="_blank"
        >
          {getMessageByLocale('component_activity_definition', settings.locale)}
        </Link>
        <Stack horizontal horizontalAlign="space-between">
          <span>Less</span>
          <div style={{ marginTop: '-12px', maxWidth: '80px' }}>
            <SwatchColorPicker
              columnCount={4}
              cellShape={'square'}
              cellHeight={10}
              cellWidth={10}
              colorCells={colorCellsExample1}
            />
          </div>
          <span>More</span>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Graph;
