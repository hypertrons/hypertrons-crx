import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface BarsProps {
  theme: 'light' | 'dark';
  height: number;
  xAxisData: string[];
  data1: number[];
  data2: number[];
}

const Bars: React.FC<BarsProps> = (props) => {
  const { theme, height, xAxisData, data1, data2 } = props;
  const divEL = useRef(null);

  const option: echarts.EChartsOption = {
    legend: {
      data: ['Activity', 'Influence'],
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: xAxisData,
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (num: number, index: number) => {
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
          return (
            (num / si[i].value).toFixed(2).replace(rx, '$1') + si[i].symbol
          );
        },
      },
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0],
        start: 0,
        end: 100,
      },
    ],
    series: [
      {
        name: 'Activity',
        type: 'bar',
        data: data1,
        emphasis: {
          focus: 'series',
        },
        animationDelay: function (idx: any) {
          return idx * 10;
        },
      },
      {
        name: 'Influence',
        type: 'bar',
        data: data2,
        emphasis: {
          focus: 'series',
        },
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
    }
  }, []);

  return <div ref={divEL} style={{ width: '100%', height }}></div>;
};

export default Bars;
