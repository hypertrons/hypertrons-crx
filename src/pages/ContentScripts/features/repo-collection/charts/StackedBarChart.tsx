import React, { useEffect, useMemo, useRef, useState } from 'react';
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

interface StackedBarChartProps {
  theme: 'light' | 'dark';
  height: number;
  repoNames: string[];

  currentRepo?: string;
}

const StackedBarChart = (props: StackedBarChartProps): JSX.Element => {
  const { theme, height, repoNames, currentRepo } = props;
  const divEL = useRef(null);
  const TH = theme == 'light' ? LIGHT_THEME : DARK_THEME;
  const [data, setData] = useState<{ [repo: string]: RawRepoData }>({});

  // Fetch data for the specified repositories
  useEffect(() => {
    const fetchData = async () => {
      const repoData: { [repo: string]: RawRepoData } = {};
      for (const repo of repoNames) {
        try {
          repoData[repo] = await getStars(repo);
        } catch (error) {
          console.error(`Error fetching stars data for ${repo}:`, error);
          repoData[repo] = {};
        }
      }
      setData(repoData);
    };
    fetchData();
  }, [repoNames]);

  // Preprocess the data
  const preprocessedData = useMemo(() => addPreviousMonth(data), [data]);

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
        type: 'inside',
        start: 0,
        end: 100,
        minValueSpan: 3600 * 24 * 1000 * 180,
      },
    ],
    series: StarSeries(preprocessedData),
  };
  //console.log('StackedBarChartseries', StarSeries(preprocessedData));

  useEffect(() => {
    let chartDOM = divEL.current;

    const instance = echarts.init(chartDOM as any);
    instance.setOption(option);
    instance.dispatchAction({
      type: 'highlight',
      seriesIndex: Number(currentRepo),
      dataIndex: Number(currentRepo),
      name: repoNames[Number(currentRepo)],
      seriesName: repoNames[Number(currentRepo)],
    });
    return () => {
      instance.dispose();
    };
  }, [option, currentRepo]);

  return <div ref={divEL} style={{ width: '100%', height: height }}></div>;
};

// Preprocess data by adding previous month data
const addPreviousMonth = (data: { [repo: string]: RawRepoData }) => {
  const preprocessedData: { [repo: string]: [string, number][] } = {};
  let maxLength = 0;

  // Iterate through the data of each repository
  for (const [repoName, repoData] of Object.entries(data)) {
    const generatedData = generateDataByMonth(repoData);
    preprocessedData[repoName] = generatedData;

    // Update the maximum length
    maxLength = Math.max(maxLength, generatedData.length);
  }
  // // Fill in arrays with months
  for (const repoData of Object.values(preprocessedData)) {
    while (repoData.length < maxLength) {
      const [year, month] = repoData[0][0].split('-');
      const previousMonth = new Date(parseInt(year), parseInt(month) - 1, 1)
        .toISOString()
        .slice(0, 7);
      repoData.unshift([previousMonth, 0]);
    }
  }

  return preprocessedData;
};

// Generate chart series for each repository
const StarSeries = (data: {
  [repo: string]: [string, number][];
}): echarts.SeriesOption[] =>
  Object.entries(data).map(([repoName, repoData]) => ({
    name: repoName,
    type: 'bar',
    stack: 'total',
    // emphasis: emphasisStyle,
    data: repoData,
    emphasis: {
      focus: 'series',
    },
    triggerLineEvent: true,
  }));

export default StackedBarChart;
