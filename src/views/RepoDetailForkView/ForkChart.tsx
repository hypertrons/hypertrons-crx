import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const COLORS = {
  FG_COLOR: '#c9d1d9',
  BG_COLOR: '#0d1118',
  SPLIT_LINE: 'grey',
  PALLET: ['mediumpurple'],
};

interface ForkChartProps {
  width: number;
  height: number;
  data: [string, number][];
}

const ForkChart: React.FC<ForkChartProps> = (props) => {
  const { width, height, data } = props;

  const divEL = useRef(null);

  const option: echarts.EChartsOption = {
    color: COLORS.PALLET,
    title: {
      text: 'Fork Event',
      textStyle: {
        fontSize: 14,
        color: COLORS.FG_COLOR,
      },
    },
    tooltip: {
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
        name: 'Fork Event',
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
  let res = `${params.seriesName} (${params.data[0]})<br/>
  ${params.marker}  ${params.data[1]}`;
  return res;
};

const formatNum = (num: number, index: number) => {
  let si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
  ];
  let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(2).replace(rx, '$1') + si[i].symbol;
};

export default ForkChart;
