import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

import { formatNum, numberWithCommas } from '../../../../helpers/formatter';

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

const MergedLinesChart = (props: MergedLinesChartProps): JSX.Element => {
  const { theme, width, height, data } = props;
  const mergedCodeAdditionData = data['mergedCodeAddition'];
  const startTime = Number(mergedCodeAdditionData[0][0].split('-')[0]);
  const endTime = Number(
    mergedCodeAdditionData[mergedCodeAdditionData.length - 1][0].split('-')[0]
  );
  const timeLength = endTime - startTime;
  const minInterval =
    timeLength > 2 ? 365 * 24 * 3600 * 1000 : 30 * 3600 * 24 * 1000;
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
        addition: data.mergedCodeAddition.length > 0,
        deletion: data.mergedCodeDeletion.length > 0,
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
        name: 'addition',
        type: 'line',
        symbol: 'none',
        areaStyle: {},
        lineStyle: {
          width: 1,
        },
        data: data.mergedCodeAddition,
        emphasis: {
          focus: 'series',
        },
        yAxisIndex: 0,
      },
      {
        name: 'deletion',
        type: 'line',
        symbol: 'none',
        areaStyle: {},
        lineStyle: {
          width: 1,
        },
        data: data.mergedCodeDeletion,
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
  const series0 = params[0];
  const series1 = params[1];
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
  let res = `
    <div style="width:140px;">
      ${ym}<br/>
      ${html0}
      ${html1}
    </div>
  `;
  return res;
};

export default MergedLinesChart;
