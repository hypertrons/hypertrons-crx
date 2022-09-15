import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

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

interface BarsProps {
  theme: 'light' | 'dark';
  height: number;
  legend1: string;
  legend2: string;
  yName1: string;
  yName2: string;
  data1: [string, number][];
  data2: [string, number][];
  onClick?: Function;
}

const Bars: React.FC<BarsProps> = (props) => {
  const {
    theme,
    height,
    legend1,
    legend2,
    yName1,
    yName2,
    data1,
    data2,
    onClick,
  } = props;

  const divEL = useRef(null);

  const TH = theme == 'light' ? LIGHT_THEME : DARK_THEME;
  const option: echarts.EChartsOption = {
    color: TH.PALLET,
    legend: {
      data: [legend1, legend2],
      textStyle: {
        color: TH.FG_COLOR,
      },
    },
    tooltip: {
      textStyle: {
        color: TH.FG_COLOR,
      },
      backgroundColor: TH.BG_COLOR,
      formatter: tooltipFormatter,
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false,
      },
      axisLabel: {
        color: TH.FG_COLOR,
      },
    },
    yAxis: [
      {
        type: 'value',
        name: yName1,
        nameTextStyle: {
          color: TH.FG_COLOR,
        },
        position: 'left',
        axisLine: {
          show: true,
        },
        axisLabel: {
          formatter: formatNum,
        },
      },
      {
        type: 'value',
        name: yName2,
        nameTextStyle: {
          color: TH.FG_COLOR,
        },
        position: 'right',
        axisLine: {
          show: true,
        },
        axisLabel: {
          formatter: formatNum,
        },
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0],
        yAxisIndex: [0, 1],
        start: 0,
        end: 100,
        minValueSpan: 3600 * 24 * 1000 * 180,
      },
    ],
    series: [
      {
        name: legend1,
        type: 'bar',
        data: data1,
        emphasis: {
          focus: 'series',
        },
        yAxisIndex: 0,
        animationDelay: function (idx: any) {
          return idx * 10;
        },
      },
      {
        name: legend2,
        type: 'bar',
        data: data2,
        emphasis: {
          focus: 'series',
        },
        yAxisIndex: 1,
        animationDelay: function (idx: any) {
          return idx * 10 + 100;
        },
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
      if (onClick) {
        instance.on('click', (params) => {
          onClick(params);
        });
      }
    }
  }, []);

  return <div ref={divEL} style={{ width: '100%', height }}></div>;
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
    // { value: 1e6, symbol: "M" },
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

export default Bars;
