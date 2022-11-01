import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { formatNum, numberWithCommas } from '../../utils/formatter';

const LIGHT_THEME = {
  FG_COLOR: '#24292F',
  BG_COLOR: '#ffffff',
  SPLIT_LINE_COLOR: '#D0D7DE',
  PALLET: ['green', 'red'],
};

const DARK_THEME = {
  FG_COLOR: '#c9d1d9',
  BG_COLOR: '#0d1118',
  SPLIT_LINE_COLOR: '#30363D',
  PALLET: ['green', 'red'],
};

interface MergedLinesChartProps {
  theme: 'light' | 'dark';
  width: number;
  height: number;
  data: any;
}

const MergedLinesChart: React.FC<MergedLinesChartProps> = (props) => {
  const { theme, width, height, data } = props;

  const divEL = useRef(null);

  const TH = theme == 'light' ? LIGHT_THEME : DARK_THEME;

  const option: echarts.EChartsOption = {
    color: TH.PALLET,
    legend: {
      show: true,
      textStyle: {
        color: TH.FG_COLOR,
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
        name: 'additions',
        type: 'line',
        symbol: 'none',
        areaStyle: {},
        lineStyle: {
          width: 1,
        },
        data: data.ad,
        emphasis: {
          focus: 'series',
        },
        yAxisIndex: 0,
      },
      {
        name: 'deletions',
        type: 'line',
        symbol: 'none',
        areaStyle: {},
        lineStyle: {
          width: 1,
        },
        data: data.de,
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
  const ym = series0.data[0];
  let res = `
    <div style="width:140px;">
      ${ym}<br/>
      <span style="float:left;">${series0.marker}${series0.seriesName}</span>
      <span style="float:right;font-weight:bold;">${numberWithCommas(
        series0.data[1]
      )}</span><br/>
      <span style="float:left;">${series1.marker}${series1.seriesName}</span>
      <span style="float:right;font-weight:bold;">${numberWithCommas(
        series1.data[1]
      )}</span><br/>
    </div>
  `;
  return res;
};

export default MergedLinesChart;
