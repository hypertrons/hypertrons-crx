import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import generateDataByMonth from '../../../../../helpers/generate-data-by-month';
import { getStars } from '../../../../../api/repo';

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

interface LineChartProps {
  theme: 'light' | 'dark';
  height: number;
  repoNames: string[];

  currentRepo?: string;
}

const LineChart = (props: LineChartProps): JSX.Element => {
  const { theme, height, repoNames, currentRepo } = props;

  const divEL = useRef(null);
  const TH = theme == 'light' ? LIGHT_THEME : DARK_THEME;
  const [data, setData] = useState<{ [repo: string]: RawRepoData }>({});

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      type: 'scroll',
    },
    grid: {
      left: '5%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false,
      },
      axisLabel: {
        color: TH.FG_COLOR,
        formatter: {
          year: '{yearStyle|{yy}}',
          month: '{MMM}',
        },
        rich: {
          yearStyle: {
            fontWeight: 'bold',
          },
        },
      },
    },
    yAxis: {
      type: 'value',
    },
    dataZoom: [
      {
        type: 'slider',
      },
      {
        type: 'inside',
        // start: 0,
        // end: 100,
        minValueSpan: 3600 * 24 * 1000 * 180,
      },
    ],
    series: LineChartSeries(data),
  };

  useEffect(() => {
    const fetchData = async () => {
      for (const repo of repoNames) {
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
const LineChartSeries = (data: {
  [repo: string]: RawRepoData;
}): echarts.SeriesOption[] =>
  Object.entries(data).map(([repoName, repoData]) => ({
    name: repoName,
    type: 'line',
    symbol: 'none',
    smooth: true,
    data: generateDataByMonth(repoData),
    emphasis: {
      focus: 'series',
    },
    yAxisIndex: 0,
    triggerLineEvent: true,
  }));
export default LineChart;
