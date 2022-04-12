import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface RadarProps {
  theme: 'light' | 'dark';
  height: number;
  indicators: string[];
  maxScales: number[];
  values: number[];
}

const Radar: React.FC<RadarProps> = (props) => {
  const { theme, height, indicators, maxScales, values } = props;
  const divEL = useRef(null);

  const option = {
    legend: undefined,
    tooltip: undefined,
    radar: {
      shape: 'circle',
      indicator: indicators.map((item: any, index: any) => {
        return { name: item, max: maxScales[index] };
      }),
      center: ['50%', '50%'],
      splitNumber: 3,
      name: {
        textStyle: {
          color: theme === 'light' ? '#010409' : '#f0f6fc',
          fontSize: 13,
          textShadowColor: theme === 'light' ? '#010409' : '#f0f6fc',
          textShadowBlur: 0.01,
          textShadowOffsetX: 0.01,
          textShadowOffsetY: 0.01,
        },
      },
      splitArea: {
        areaStyle: {
          color: [theme == 'light' ? 'darkblue' : '#58a6ff'],
          opacity: 1,
        },
      },
      axisLine: {
        lineStyle: {
          width: 2,
          color: 'white',
          opacity: 0.4,
        },
      },
      splitLine: {
        lineStyle: {
          color: 'white',
          width: 1.5,
          opacity: 0.4,
        },
      },
    },
    series: [
      {
        type: 'radar',
        symbol: 'none',
        itemStyle: {},
        lineStyle: {
          width: 1.5,
          color: 'white',
          opacity: 1,
          shadowBlur: 4,
          shadowColor: 'white',
          shadowOffsetX: 0.5,
          shadowOffsetY: 0.5,
        },
        areaStyle: {
          color: 'white',
          opacity: 0.8,
        },
        data: [
          {
            value: values,
          },
        ],
      },
    ],
    animation: true,
    animationDurationUpdate: 200,
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
  }, [indicators, values]);

  return <div ref={divEL} style={{ width: '100%', height }}></div>;
};

export default Radar;
