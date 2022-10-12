import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { formatNum, numberWithCommas } from '../../utils/formatter';

const COLORS = {
  FG_COLOR: '#c9d1d9',
  BG_COLOR: '#0d1118',
  SPLIT_LINE: 'grey',
  PALLET: ['green', '#8250df', '#f78166'],
};

interface PRChartProps {
  width: number;
  height: number;
  data: any;
}

const PRChart: React.FC<PRChartProps> = (props) => {
  const { width, height, data } = props;

  const divEL = useRef(null);

  const option: echarts.EChartsOption = {
    color: COLORS.PALLET,
    title: {
      text: 'Open PR, PR Merge, Review Comment Events',
      textStyle: {
        fontSize: 13,
        color: COLORS.FG_COLOR,
      },
    },
    legend: {
      show: true,
      top: '10%',
      textStyle: {
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
      top: '25%',
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
        name: 'opens',
        type: 'line',
        symbol: 'none',
        data: data.op,
        emphasis: {
          focus: 'series',
        },
        yAxisIndex: 0,
      },
      {
        name: 'merges',
        type: 'line',
        symbol: 'none',
        data: data.pm,
        emphasis: {
          focus: 'series',
        },
        yAxisIndex: 0,
      },
      {
        name: 'reviews',
        type: 'line',
        symbol: 'none',
        data: data.rc,
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
  const series0 = params[0];
  const series1 = params[1];
  const series2 = params[2];
  const ym = series0.data[0];
  const html0 = series0
    ? `
    <span style="float:left;">${series0.marker}${series0.seriesName}</span>
    <span style="float:right;font-weight:bold;">${numberWithCommas(
      series0.data[1]
    )}</span><br/> `
    : '';
  const html1 = series1
    ? `
    <span style="float:left;">${series1.marker}${series1.seriesName}</span>
    <span style="float:right;font-weight:bold;">${numberWithCommas(
      series1.data[1]
    )}</span><br/> `
    : '';
  const html2 = series2
    ? `
    <span style="float:left;">${series2.marker}${series2.seriesName}</span>
    <span style="float:right;font-weight:bold;">${numberWithCommas(
      series2.data[1]
    )}</span><br/> `
    : '';
  let res = `
    <div style="width:110px;">
      ${ym}<br/>
      ${html0}
      ${html1}
      ${html2}
    </div>
  `;
  return res;
};

export default PRChart;
