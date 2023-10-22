import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import generateDataByMonth from '../../../../../helpers/generate-data-by-month';
import { getStars } from '../../../../../api/repo';
import getNewestMonth from '../../../../../helpers/get-newest-month';

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

interface BarChartProps {
  theme: 'light' | 'dark';
  height: number;
  repoNames: string[];
  currentRepo?: string;
}

const NumericPanel = (props: BarChartProps): JSX.Element => {
  const { theme, height, repoNames, currentRepo } = props;
  const divEL = useRef(null);
  const TH = theme == 'light' ? LIGHT_THEME : DARK_THEME;
  const [data, setData] = useState<{ [repo: string]: RawRepoData }>({});

  const option: echarts.EChartsOption = {
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: 'center',
        style: {
          fill: '#333',
          text: valueSum(data).toString(),
          font: 'bold 48px Arial',
        },
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      for (const repo of repoNames) {
        try {
          //getStars() to fetch repository data
          const starsData = await getStars(repo);
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

function valueSum(data: Record<string, RawRepoData>): number {
  return Object.values(data).reduce((sum, repoData) => {
    const lastData = generateDataByMonth(repoData).at(-1);
    const value =
      lastData !== undefined && lastData[0] === getNewestMonth()
        ? lastData[1]
        : 0;
    return sum + value;
  }, 0);
}

export default NumericPanel;
