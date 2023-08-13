import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import generateDataByMonth from '../../../helpers/generate-data-by-month';
import { getStars } from '../../../api/repo';

//const RepoName = ['X-lab2017/open-digger','hypertrons/hypertrons-crx'];
const RepoName = [
  'X-lab2017/open-digger',
  'hypertrons/hypertrons-crx',
  'X-lab2017/oss101',
];
// 声明 rawRepoData 的结构
interface RawRepoData {
  [date: string]: number;
}

const computeSeriesData = (data: { [repo: string]: RawRepoData }) =>
  Object.entries(data).map(([repoName, repoData]) => ({
    name: repoName, // 系列的名称为仓库名
    type: 'line',
    data: generateDataByMonth(repoData), // 使用对应仓库的数据
  }));

const LineChart = () => {
  const divEL = useRef(null);
  const [data, setData] = useState<{ [repo: string]: RawRepoData }>({});

  useEffect(() => {
    const fetchData = async () => {
      for (const repo of RepoName) {
        try {
          // 调用 getStars() 获取仓库数据
          const starsData = await getStars(repo);
          // 更新 Data
          setData((prevData) => ({ ...prevData, [repo]: starsData }));
        } catch (error) {
          console.error(`Error fetching stars data for ${repo}:`, error);
          // 如果获取失败，则将数据置为空对象
          setData((prevData) => ({ ...prevData, [repo]: {} }));
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let chartDOM = divEL.current;
    const option = {
      title: {
        text: 'Line Chart',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
      },
      grid: {
        left: '5%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'time',
        axisLabel: {
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
      series: computeSeriesData(data), // 使用转换后的系列数据
    };
    const instance = echarts.init(chartDOM as any);
    instance.setOption(option);
    return () => {
      instance.dispose();
    };
  }, [data]);

  return <div ref={divEL} style={{ width: '100%', height: '100%' }}></div>;
};

export default LineChart;
