import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

import { formatNum, numberWithCommas } from '../../../../helpers/formatter';
import { getInterval, judgeInterval } from '../../../../helpers/judge-interval';
const LIGHT_THEME = {
  FG_COLOR: '#24292F',
  BG_COLOR: '#ffffff',
  SPLIT_LINE_COLOR: '#D0D7DE',
  BAR_COLOR: '#9B71FF',
  LINE_COLOR: '#8D5BFF',
};

const DARK_THEME = {
  FG_COLOR: '#c9d1d9',
  BG_COLOR: '#0d1118',
  SPLIT_LINE_COLOR: '#30363D',
  BAR_COLOR: '#9B71FF',
  LINE_COLOR: '#BFA3FF',
};

interface ForkChartProps {
  theme: 'light' | 'dark';
  width: number;
  height: number;
  data: [string, number][];
}

const ForkChart = (props: ForkChartProps): JSX.Element => {
  const { theme, width, height, data } = props;
  const { timeLength, minInterval } = getInterval(data);
  const divEL = useRef(null);

  const TH = theme == 'light' ? LIGHT_THEME : DARK_THEME;
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      textStyle: {
        color: TH.FG_COLOR,
      },
      backgroundColor: TH.BG_COLOR,
      formatter: tooltipFormatter,
    },
    grid: {
      top: '5%',
      bottom: '5%',
      left: '5%',
      right: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'time',
      // 30 * 3600 * 24 * 1000  milliseconds
      splitLine: {
        show: false,
      },
      minInterval: minInterval,
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
        name: 'Fork Event',
        type: 'bar',
        data: data,
        itemStyle: {
          color: TH.BAR_COLOR,
        },
        emphasis: {
          focus: 'series',
        },
        yAxisIndex: 0,
      },
      {
        type: 'line',
        symbol: 'none',
        lineStyle: {
          color: TH.LINE_COLOR,
        },
        data: data,
        emphasis: {
          focus: 'series',
        },
        yAxisIndex: 0,
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
    }
  }, []);

  return <div ref={divEL} style={{ width, height }}></div>;
};

const tooltipFormatter = (params: any) => {
  const res = `
    ${params[0].data[0]}<br/>
    ${params[0].marker}
    <span style="font-weight:bold;">
      ${numberWithCommas(params[0].data[1])}
    </span>
  `;
  return res;
};

export default ForkChart;
