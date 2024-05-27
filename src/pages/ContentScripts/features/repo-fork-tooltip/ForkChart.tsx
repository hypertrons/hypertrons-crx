import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

import { formatNum, numberWithCommas } from '../../../../helpers/formatter';
import { min } from 'lodash-es';

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
  const startTime = Number(data[0][0].split('-')[0]);
  const endTime = Number(data[data.length - 1][0].split('-')[0]);
  const timeLength = endTime - startTime;
  const minInterval = timeLength > 2 ? 365 * 24 * 3600 * 1000 : 30 * 3600 * 24 * 1000;
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
      if (timeLength > 2) {
        instance.on('dataZoom', (params: any) => {
          let option = instance.getOption() as {
            xAxis: { minInterval?: any }[];
          };
          const startValue = params.batch[0].start;
          const endValue = params.batch[0].end;
          let minInterval: number;
          if (startValue == 0 && endValue == 100) {
            minInterval = 365 * 24 * 3600 * 1000;
          } else {
            minInterval = 30 * 24 * 3600 * 1000;
          }
          option.xAxis[0].minInterval = minInterval;
          instance.setOption(option);
        });
      }
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
