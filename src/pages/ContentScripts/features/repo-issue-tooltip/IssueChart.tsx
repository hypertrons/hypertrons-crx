import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

import { formatNum, numberWithCommas } from '../../../../helpers/formatter';
import { getInterval, judgeInterval } from '../../../../helpers/judge-interval';
const LIGHT_THEME = {
  FG_COLOR: '#24292F',
  BG_COLOR: '#ffffff',
  SPLIT_LINE_COLOR: '#D0D7DE',
  PALLET: ['#34BF5B', '#9B71FF', '#FF8061'],
};

const DARK_THEME = {
  FG_COLOR: '#c9d1d9',
  BG_COLOR: '#0d1118',
  SPLIT_LINE_COLOR: '#30363D',
  PALLET: ['#34BF5B', '#9B71FF', '#FF8061'],
};

interface IssueChartProps {
  theme: 'light' | 'dark';
  width: number;
  height: number;
  data: any;
  onClick?: Function;
}

const IssueChart = (props: IssueChartProps): JSX.Element => {
  const { theme, width, height, data, onClick } = props;
  const { timeLength, minInterval } = getInterval(data['issueComments']);
  const divEL = useRef(null);

  const TH = theme == 'light' ? LIGHT_THEME : DARK_THEME;

  const option: echarts.EChartsOption = {
    color: TH.PALLET,
    legend: {
      show: true,
      textStyle: {
        color: TH.FG_COLOR,
      },
      selected: {
        open: data.issuesOpened.length > 0,
        close: data.issuesClosed.length > 0,
        comment: data.issueComments.length > 0,
      },
    },
    tooltip: {
      trigger: 'axis',
      textStyle: {
        color: TH.FG_COLOR,
      },
      backgroundColor: TH.BG_COLOR,
      formatter: tooltipFormatter,
    },
    grid: {
      top: '15%',
      bottom: '5%',
      left: '5%',
      right: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'time',
      // 30 * 3600 * 24 * 1000  milliseconds
      minInterval: minInterval,
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
    yAxis: [
      {
        type: 'value',
        position: 'left',
        axisLabel: {
          color: TH.FG_COLOR,
          formatter: formatNum,
        },
        splitLine: {
          lineStyle: {
            color: TH.SPLIT_LINE_COLOR,
          },
        },
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
        minValueSpan: 3600 * 24 * 1000 * 180,
      },
    ],
    series: [
      {
        name: 'open',
        type: 'line',
        symbol: 'none',
        data: data.issuesOpened,
        emphasis: {
          focus: 'series',
        },
        yAxisIndex: 0,
        triggerLineEvent: true,
      },
      {
        name: 'close',
        type: 'line',
        symbol: 'none',
        data: data.issuesClosed,
        emphasis: {
          focus: 'series',
        },
        yAxisIndex: 0,
        triggerLineEvent: true,
      },
      {
        name: 'comment',
        type: 'line',
        symbol: 'none',
        data: data.issueComments,
        emphasis: {
          focus: 'series',
        },
        yAxisIndex: 0,
        triggerLineEvent: true,
      },
    ],
    animationEasing: 'elasticOut',
    animationDelayUpdate: function (idx: any) {
      return idx * 5;
    },
  };

  useEffect(() => {
    let chartDOM = divEL.current;
    const instance = echarts.init(chartDOM as any);

    return () => {
      instance.dispose();
    };
  }, []);

  useEffect(() => {
    let chartDOM = divEL.current;
    const instance = echarts.getInstanceByDom(chartDOM as any);
    if (instance) {
      judgeInterval(instance, option, timeLength);
      instance.setOption(option);
      if (onClick) {
        instance.on('click', (params) => {
          onClick(curMonth, params);
        });
      }
    }
  }, []);

  return <div ref={divEL} style={{ width, height }}></div>;
};

let curMonth: string;

const tooltipFormatter = (params: any) => {
  curMonth = params[0].data[0];
  const series0 = params[0];
  const series1 = params[1];
  const series2 = params[2];
  const ym = series0.data[0];
  const html0 = series0
    ? `
    <span style="float:left;">${series0.marker}${series0.seriesName}</span>
    <span style="float:right;font-weight:bold;">${numberWithCommas(series0.data[1])}</span><br/> `
    : '';
  const html1 = series1
    ? `
    <span style="float:left;">${series1.marker}${series1.seriesName}</span>
    <span style="float:right;font-weight:bold;">${numberWithCommas(series1.data[1])}</span><br/> `
    : '';
  const html2 = series2
    ? `
    <span style="float:left;">${series2.marker}${series2.seriesName}</span>
    <span style="float:right;font-weight:bold;">${numberWithCommas(series2.data[1])}</span><br/> `
    : '';
  let res = `
    <div style="width:130px;">
      ${ym}<br/>
      ${html0}
      ${html1}
      ${html2}
    </div>
  `;
  return res;
};

export default IssueChart;
