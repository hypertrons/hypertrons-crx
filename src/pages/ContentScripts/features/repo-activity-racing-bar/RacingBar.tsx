import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

interface RacingBarProps {
  //theme: 'light' | 'dark';
  height: number;
  repoName: string;
  data: any;
  replay: number;
}

const RacingBar = (props: RacingBarProps): JSX.Element => {
  const { height, data, replay } = props;
  const divEL = useRef(null);
  const updateFrequency = 3000;
  const colorMap = new Map();
  const option = {
    grid: {
      top: 10,
      bottom: 30,
      left: 150,
      right: 50,
    },
    xAxis: {
      max: 'dataMax',
    },
    yAxis: {
      type: 'category',
      inverse: true,
      max: 10,
      axisLabel: {
        show: true,
        fontSize: 14,
        formatter: function (value: string) {
          if (!value || value.endsWith('[bot]')) return value;
          return `${value} {avatar${value.replaceAll('-', '')}|}`;
        },
        rich: null,
      },
      animationDuration: 300,
      animationDurationUpdate: 300,
    },
    series: [
      {
        realtimeSort: true,
        seriesLayoutBy: 'column',
        type: 'bar',
        itemStyle: {
          color: function (params: { value: any[] }) {
            const githubId = params.value[0];
            if (colorMap.has(githubId)) {
              return colorMap.get(githubId);
            } else {
              const randomColor =
                '#' + Math.floor(Math.random() * 16777215).toString(16);
              colorMap.set(githubId, randomColor);
              return randomColor;
            }
          },
        },
        data: null,
        encode: {
          x: 1,
          y: 0,
        },
        label: {
          show: true,
          precision: 1,
          position: 'right',
          valueAnimation: true,
          fontFamily: 'monospace',
        },
      },
    ],
    // Disable init animation.
    animationDuration: 0,
    animationDurationUpdate: updateFrequency,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear',
    graphic: {
      elements: [
        {
          type: 'text',
          right: 60,
          bottom: 60,
          style: {
            text: null,
            font: 'bolder 60px monospace',
            fill: 'rgba(100, 100, 100, 0.25)',
          },
          z: 100,
        },
      ],
    },
  };

  useEffect(() => {
    // @ts-ignore
    let chartDOM = divEL.current;
    const instance = echarts.init(chartDOM as any);
    // 组件卸载时销毁图表
    return () => {
      if (!instance.isDisposed()) {
        instance.dispose();
      }
    };
  }, [replay]);

  useEffect(() => {
    let chartDOM = divEL.current;
    const instance: any = echarts.getInstanceByDom(chartDOM as any);
    const months = Object.keys(data);
    // 在数据变化时调用图表更新函数
    // 根据传入的新数据进行图表的更新操作
    let startIndex = 0;

    for (let i = startIndex; i < months.length - 1; ++i) {
      setTimeout(function () {
        updateMonth(months[i + 1]);
        if (i + 1 === months.length - 1) {
        }
      }, (i - startIndex) * updateFrequency);
    }

    // @ts-ignore
    function updateMonth(month: string | null) {
      const rich = {};
      // @ts-ignore
      data[month].forEach((item: any[]) => {
        // rich name cannot contain special characters such as '-'
        // @ts-ignore
        rich[`avatar${item[0].replaceAll('-', '')}`] = {
          backgroundColor: {
            image: `https://avatars.githubusercontent.com/${item[0]}?s=48&v=4`,
          },
          height: 20,
        };
      });
      // @ts-ignore
      option.yAxis.axisLabel.rich = rich;
      // @ts-ignore
      option.series[0].data = data[month];
      // @ts-ignore
      option.graphic.elements[0].style.text = month;
      // @ts-ignore
      if (!instance.isDisposed()) {
        instance.setOption(option);
      }
    }
  }, [replay]);

  return (
    <div className="hypertrons-crx-border">
      <div ref={divEL} style={{ width: '100%', height }}></div>
    </div>
  );
};

export default RacingBar;
