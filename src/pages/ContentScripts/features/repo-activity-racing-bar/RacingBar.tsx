import { RepoActivityDetails } from './data';
import { avatarColorStore } from './AvatarColorStore';
import { countLongTermContributors } from './data';
import { useLoadedAvatars } from './useLoadedAvatars';

import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  ForwardedRef,
} from 'react';
import * as echarts from 'echarts';
import { Spin } from 'antd';
import type { BarSeriesOption, EChartsOption, EChartsType } from 'echarts';

export interface MediaControlers {
  play: () => void;
}

interface RacingBarProps {
  speed: number;
  data: RepoActivityDetails;
}

const updateFrequency = 3000;

const option: EChartsOption = {
  grid: {
    top: 10,
    bottom: 30,
    left: 160,
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
    },
    axisTick: {
      show: false,
    },
    animationDuration: 0,
    animationDurationUpdate: 200,
  },
  series: [
    {
      realtimeSort: true,
      seriesLayoutBy: 'column',
      type: 'bar',
      data: undefined,
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
          text: undefined,
          font: 'bolder 60px monospace',
          fill: 'rgba(100, 100, 100, 0.25)',
        },
        z: 100,
      },
    ],
  },
};

const updateMonth = async (
  instance: EChartsType,
  data: RepoActivityDetails,
  month: string
) => {
  const rich: any = {};
  const barData: BarSeriesOption['data'] = await Promise.all(
    data[month].map(async (item) => {
      // rich name cannot contain special characters such as '-'
      rich[`avatar${item[0].replaceAll('-', '')}`] = {
        backgroundColor: {
          image: `https://avatars.githubusercontent.com/${item[0]}?s=48&v=4`,
        },
        height: 20,
      };
      const avatarColors = await avatarColorStore.getColors(item[0]);
      return {
        value: item,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: avatarColors[0],
              },
              {
                offset: 0.5,
                color: avatarColors[1],
              },
            ],
            global: false,
          },
        },
      };
    })
  );
  // @ts-ignore
  option.yAxis.axisLabel.rich = rich;
  // @ts-ignore
  option.series[0].data = barData;
  // @ts-ignore
  option.graphic.elements[0].style.text = month;

  // it seems that hidden bars are also rendered, so when each setOption merge more data into the chart,
  // the fps goes down. So we use notMerge to avoid merging data. But this disables the xAxis animation.
  // Hope we can find a better solution.
  instance.setOption(option, {
    notMerge: true,
  });
};

let timer: NodeJS.Timeout;

const playFromStart = (instance: EChartsType, data: RepoActivityDetails) => {
  const months = Object.keys(data);
  let i = 0;

  const playNext = async () => {
    await updateMonth(instance, data, months[i]);
    i++;
    if (i < months.length) {
      timer = setTimeout(playNext, updateFrequency);
    }
  };

  playNext();
};

const RacingBar = forwardRef(
  (
    { speed, data }: RacingBarProps,
    forwardedRef: ForwardedRef<MediaControlers>
  ): JSX.Element => {
    const divEL = useRef<HTMLDivElement>(null);

    let height = 300;
    const [longTermContributorsCount, contributors] =
      countLongTermContributors(data);

    const [loadedAvatars, loadAvatars] = useLoadedAvatars(contributors);

    if (longTermContributorsCount >= 20) {
      // @ts-ignore
      option.yAxis.max = 20;
      height = 600;
    }

    useEffect(() => {
      (async () => {
        if (!divEL.current) return;
        await loadAvatars();
        play();
      })();
    }, []);

    const play = () => {
      if (!divEL.current) return;

      // clear timer if user replay the chart before it finishes
      if (timer) {
        clearTimeout(timer);
      }
      let instance = echarts.getInstanceByDom(divEL.current)!;
      if (instance && !instance.isDisposed()) {
        instance.dispose();
      }
      const chartDOM = divEL.current;
      instance = echarts.init(chartDOM);
      playFromStart(instance, data);
    };

    // expose startRecording and stopRecording to parent component
    useImperativeHandle(forwardedRef, () => ({
      play,
    }));

    return (
      <div className="hypertrons-crx-border">
        <Spin
          spinning={loadedAvatars < contributors.length}
          tip={`Loading avatars ${loadedAvatars}/${contributors.length}`}
          style={{ maxHeight: 'none' }} // disable maxHeight to make the loading tip be placed in the center
        >
          <div ref={divEL} style={{ width: '100%', height }} />
        </Spin>
      </div>
    );
  }
);

export default RacingBar;
