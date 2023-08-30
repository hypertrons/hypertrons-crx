import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import generateDataByMonth from '../../../helpers/generate-data-by-month';
import { getStars } from '../../../api/repo';

interface RawRepoData {
  [date: string]: number;
}

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

interface PieChartProps {
  theme: 'light' | 'dark';
  height: number;
  RepoName: string[];
}

const PieChart = (props: PieChartProps): JSX.Element => {
  const { theme, height, RepoName } = props;
  const divEL = useRef(null);
  const TH = theme == 'light' ? LIGHT_THEME : DARK_THEME;
  const [data, setData] = useState<{ [repo: string]: RawRepoData }>({});

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      type: 'scroll',
    },

    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        data: PieChartData(data),
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      for (const repo of RepoName) {
        try {
          //getStars() to fetch repository data
          const starsData = await getStars(repo);
          // Update Data
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
    instance.setOption(option);
    return () => {
      instance.dispose();
    };
  }, [data]);

  return <div ref={divEL} style={{ width: '100%', height: height }}></div>;
};

// Retrieve data for the current month
const PieChartData = (data: { [repo: string]: RawRepoData }) =>
  Object.entries(data).map(([repoName, repoData]) => ({
    name: repoName,
    value: generateDataByMonth(repoData).pop()![1],
  }));

export default PieChart;
