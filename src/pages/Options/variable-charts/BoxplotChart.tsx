import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import generateDataByMonth from '../../../helpers/generate-data-by-month';
import { getIssueResponseTime } from '../../../api/repo';
import getNewestMonth from '../../../helpers/get-newest-month';

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
  RepoName: string[];
}

const BoxplotChart = (props: BarChartProps): JSX.Element => {
  const { theme, height, RepoName } = props;
  const divEL = useRef(null);
  const TH = theme == 'light' ? LIGHT_THEME : DARK_THEME;
  const [data, setData] = useState<{}>({});

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow',
      },
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
      type: 'category',
      // data: Object.keys(data),
      splitLine: {
        show: false,
      },
      data: lastMonthRepoData(data).map((repo) => repo.name),
      splitArea: {
        show: true,
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
      splitArea: {
        show: true,
      },
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
        minValueSpan: 3600 * 24 * 1000 * 180,
      },
    ],
    series: {
      type: 'boxplot',
      data: lastMonthRepoData(data),
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      for (const repo of RepoName) {
        try {
          //getStars() to fetch repository data
          const starsData = await getIssueResponseTime(repo);
          console.log('starsDatastarsData', starsData);
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
    console.log('data', data);
  }, []);

  useEffect(() => {
    let chartDOM = divEL.current;
    const TH = 'light' ? LIGHT_THEME : DARK_THEME;

    const instance = echarts.init(chartDOM as any);
    console.log('data', data);
    console.log('lastMonthRepoData', lastMonthRepoData(data));
    instance.setOption(option);
    return () => {
      instance.dispose();
    };
  }, [data]);

  return <div ref={divEL} style={{ width: '100%', height: height }}></div>;
};

//原始数据 =>各仓库最近一个月的数据[]
function lastMonthRepoData(repo_data: any) {
  const resultArray = [];
  const lastMonth = getNewestMonth();
  for (const repoName in repo_data) {
    if (repo_data.hasOwnProperty(repoName)) {
      const lastMonthData = {
        name: repoName,
        value:
          repo_data[repoName][`avg`][lastMonth] !== undefined
            ? Array.from(
                { length: 5 },
                (_, q) => repo_data[repoName][`quantile_${q}`][lastMonth]
              )
            : [null, null, null, null, null],
      };

      resultArray.push(lastMonthData);
      // 将转换后的数据存储为对象，并添加到结果数组中
      console.log('repoName', repoName);
      console.log('lastM', repo_data[repoName][`avg`][lastMonth]);
    }
  }
  return resultArray;
}

export default BoxplotChart;
