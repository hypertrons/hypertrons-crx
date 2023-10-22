import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import getNewestMonth from '../../../../../helpers/get-newest-month';
import { getActivityDetails } from '../../../../../api/repo';

const LIGHT_THEME = {
  FG_COLOR: '#24292f',
  BG_COLOR: '#ffffff',
  PALLET: ['#5470c6', '#91cc75'],
};

const DARK_THEME = {
  FG_COLOR: '#c9d1d9',
  BG_COLOR: '#0d1118',
  PALLET: ['#58a6ff', '#3fb950'],
};

interface SankeyChartProps {
  theme: 'light' | 'dark';
  height: number;
  repoNames: string[];

  currentRepo?: string;
}

const SankeyChart = (props: SankeyChartProps): JSX.Element => {
  const { theme, height, repoNames, currentRepo } = props;
  const divEL = useRef(null);
  const [data, setData] = useState<{ [repoName: string]: RepoData }>({});

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
    },
    // legend: {
    //   type: 'scroll',
    // },
    animation: false,
    grid: {
      left: '2%',
      right: '10%',
      bottom: '3%',
      // containLabel: true,
    },
    series: [
      {
        type: 'sankey',
        // bottom: '10%',
        emphasis: {
          focus: 'adjacency',
        },
        data: lastMonthData(data).nodes,
        links: lastMonthData(data).links,
        // orient: "vertical",
        // label: {
        //   position: "top"
        // },
        lineStyle: {
          color: 'source',
          curveness: 0.5,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      for (const repo of repoNames) {
        try {
          //getStars() to fetch repository data
          const starsData = await getActivityDetails(repo);
          // Update Data/
          setData((prevData) => ({ ...prevData, [repo]: starsData }));
        } catch (error) {
          console.error(`Error fetching stars data for ${repo}:`, error);
          // If the retrieval fails, set the data to an empty object
          setData((prevData) => ({ ...prevData, [repo]: {} }));
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let chartDOM = divEL.current;
    const TH = 'light' ? LIGHT_THEME : DARK_THEME;

    const instance = echarts.init(chartDOM as any);
    // console.log('sankeydata', data);
    // console.log('lastMonthData', lastMonthData(data));
    instance.setOption(option);
    instance.dispatchAction({
      type: 'highlight',
      // seriesIndex: Number(currentRepo),
      // dataIndex: Number(currentRepo),
      name: repoNames[Number(currentRepo)],
      seriesName: repoNames[Number(currentRepo)],
    });
    return () => {
      instance.dispose();
    };
  }, [data, currentRepo]);

  return <div ref={divEL} style={{ width: '100%', height: height }}></div>;
};

interface RepoData {
  [month: string]: [string, number][];
}

interface DataNode {
  name: string;
}

interface DataLink {
  source: string;
  target: string;
  value: number;
}

interface LastMonthData {
  nodes: DataNode[];
  links: DataLink[];
}

function lastMonthData(repo_data: {
  [repoName: string]: RepoData;
}): LastMonthData {
  const data: LastMonthData = {
    nodes: [],
    links: [],
  };
  const userSet = new Set<string>();
  const newestMonth = getNewestMonth();
  for (const [repoName, repoData] of Object.entries(repo_data)) {
    const monthData = repoData[newestMonth];
    if (monthData) {
      monthData.forEach(([userName, value]) => {
        const link: DataLink = {
          source: repoName,
          target: userName,
          value: value,
        };
        userSet.add(userName);
        data.links.push(link);
      });
    }
  }
  data.nodes = [
    ...Object.keys(repo_data).map((repoName) => ({ name: repoName })),
    ...Array.from(userSet).map((userName) => ({ name: userName })),
  ];
  // console.log(data.nodes);
  // console.log(data.links);
  return data;
}

export default SankeyChart;
