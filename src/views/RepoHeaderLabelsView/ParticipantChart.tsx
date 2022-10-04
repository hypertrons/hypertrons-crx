import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { formatNum, numberWithCommas } from '../../utils/formatter';

const COLORS = {
  FG_COLOR: '#c9d1d9',
  BG_COLOR: '#0d1118',
  SPLIT_LINE: 'grey',
  PALLET: ['#f78166'],
};

interface ParticipantChartProps {
  width: number;
  height: number;
  data: [string, number][];
}

const ParticipantChart: React.FC<ParticipantChartProps> = (props) => {
  const { width, height, data } = props;

  const divEL = useRef(null);

  const option: echarts.EChartsOption = {
    color: COLORS.PALLET,
    title: {
      text: 'Participant',
      textStyle: {
        fontSize: 14,
        color: COLORS.FG_COLOR,
      },
    },
    tooltip: {
      trigger: 'axis',
      textStyle: {
        color: COLORS.FG_COLOR,
      },
      backgroundColor: COLORS.BG_COLOR,
      formatter: tooltipFormatter,
    },
    grid: {
      top: '20%',
      left: '12%',
      width: '85%',
      height: '60%',
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false,
      },
      axisLabel: {
        color: COLORS.FG_COLOR,
      },
    },
    yAxis: [
      {
        type: 'value',
        position: 'left',
        axisLabel: {
          color: COLORS.FG_COLOR,
          formatter: formatNum,
        },
        splitLine: {
          lineStyle: {
            color: COLORS.SPLIT_LINE,
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
        type: 'bar',
        data: data,
        emphasis: {
          focus: 'series',
        },
        yAxisIndex: 0,
      },
      {
        type: 'line',
        symbol: 'none',
        lineStyle: {
          color: 'white',
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

export default ParticipantChart;
