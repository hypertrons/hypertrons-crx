import { RepoActivityDetails } from '.';
import { avatarColorStore } from './AvatarColorStore';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsOption, EChartsType, BarSeriesOption } from 'echarts';

interface RacingBarProps {
  repoName: string;
  data: RepoActivityDetails;
}

const updateFrequency = 3000;

const option: EChartsOption = {
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
                offset: 0.2,
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

const play = (instance: EChartsType, data: RepoActivityDetails) => {
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

/**
 * Count the number of unique contributors in the data
 */
const countLongTermContributors = (data: RepoActivityDetails) => {
  const contributors = new Map<string, number>();
  Object.keys(data).forEach((month) => {
    data[month].forEach((item) => {
      if (contributors.has(item[0])) {
        contributors.set(item[0], contributors.get(item[0])! + 1);
      } else {
        contributors.set(item[0], 0);
      }
    });
  });
  let count = 0;
  contributors.forEach((value) => {
    // only count contributors who have contributed more than 3 months
    if (value >= 3) {
      count++;
    }
  });
  return count;
};

const RacingBar = ({ data }: RacingBarProps): JSX.Element => {
  const divEL = useRef<HTMLDivElement>(null);

  let height = 300;
  const longTermContributorsCount = countLongTermContributors(data);
  if (longTermContributorsCount >= 20) {
    // @ts-ignore
    option.yAxis.max = 20;
    height = 600;
  }

  useEffect(() => {
    if (!divEL.current) return;

    const chartDOM = divEL.current;
    const instance = echarts.init(chartDOM);

    play(instance, data);

    return () => {
      if (!instance.isDisposed()) {
        instance.dispose();
      }
      // clear timer if user replay the chart before it finishes
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  return (
    <div className="hypertrons-crx-border">
      <div ref={divEL} style={{ width: '100%', height }}></div>
    </div>
  );
};

export default RacingBar;
