import React, { useState, CSSProperties, useEffect } from 'react';
import EChartsWrapper from './Echarts/index';
import { Stack } from 'office-ui-fabric-react';
import { isNull, linearMap } from '../../utils/utils';
import Settings, { loadSettings } from '../../utils/settings';

interface GraphProps {
  /**
   * data
   */
  readonly data: any;
  /**
   * `style` for graph container
   */
  readonly style?: CSSProperties;
  /**
   * callback function when click node
   */
  readonly onNodeClick?: Function;
  /**
   * will assign a distinguishable color to the focused node if specified
   */
  readonly focusedNodeID?: string;
}

const Graph: React.FC<GraphProps> = ({
  data,
  style = {},
  onNodeClick = (node: any) => {
    const url = 'https://github.com/' + node.id;
    window.location.href = url;
  },
  focusedNodeID,
}) => {
  const NODE_SIZE = [10, 25];

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

  const generateEchartsData = (data: any): any => {
    const generateNodes = (nodes: any[]): any => {
      const values: number[] = nodes.map((item) => item[1]);
      const minMax = [Math.min(...values), Math.max(...values)];
      return nodes.map((n: any) => {
        const avatarId = n[0].split('/')[0];
        return {
          id: n[0],
          name: n[0],
          value: n[1],
          symbolSize: linearMap(n[1], minMax, NODE_SIZE),
          symbol: `image://https://avatars.githubusercontent.com/${avatarId}`,
          label: {
            show: n[0] === focusedNodeID ? true : false,
          },
        };
      });
    };
    const generateEdges = (edges: any[]): any => {
      const threshold = edges[0][0].split('/').length === 2 ? 5 : 2.5;
      return edges
        .map((e: any) => {
          return {
            source: e[0],
            target: e[1],
            value: e[2],
          };
        })
        .filter((edge) => edge.value > threshold); // trim edges with small value to avoid a dense but useless graph
    };
    return {
      nodes: generateNodes(data.nodes),
      edges: generateEdges(data.edges),
    };
  };

  let graphData: any;
  let graphOption: any;
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
          initLayout: 'circular',
          gravity: 0.1,
          repulsion: 80,
          edgeLength: [50, 100],
          // Disable the iteration animation of layout
          layoutAnimation: false,
        },
        lineStyle: {
          curveness: 0.3,
          opacity: 0.2,
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

  if (isNull(data)) {
    return <div />;
  }

  return (
    <Stack>
      <Stack className="hypertrons-crx-border">
        <EChartsWrapper
          option={graphOption}
          style={style}
          onEvents={{
            click: {
              query: {
                dataType: 'node',
              },
              handler: onNodeClick,
            },
          }}
        />
      </Stack>
    </Stack>
  );
};

export default Graph;
