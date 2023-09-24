import { avatarColorStore } from './AvatarColorStore';

import type { BarSeriesOption, EChartsOption, EChartsType } from 'echarts';

export interface RepoActivityDetails {
  // e.g. 2020-05: [["frank-zsy", 4.69], ["heming6666", 3.46], ["menbotics[bot]", 2]]
  [key: string]: [string, number][];
}

/**
 * Count the number of unique contributors in the data
 * @returns [number of long term contributors, contributors' names]
 */
export const countLongTermContributors = (
  data: RepoActivityDetails
): [number, string[]] => {
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
  return [count, [...contributors.keys()]];
};

export const DEFAULT_FREQUENCY = 2000;

/**
 * get the echarts option with the given data, month and speed.
 */
export const getOption = async (
  data: RepoActivityDetails,
  month: string,
  speed: number,
  maxBars: number,
  enableAnimation: boolean
): Promise<EChartsOption> => {
  const updateFrequency = DEFAULT_FREQUENCY / speed;
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

  return {
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
      max: maxBars,
      axisLabel: {
        show: true,
        fontSize: 14,
        formatter: function (value: string) {
          if (!value || value.endsWith('[bot]')) return value;
          return `${value} {avatar${value.replaceAll('-', '')}|}`;
        },
        rich,
      },
      axisTick: {
        show: false,
      },
      animationDuration: 0,
      animationDurationUpdate: enableAnimation ? 200 : 0,
    },
    series: [
      {
        realtimeSort: true,
        seriesLayoutBy: 'column',
        type: 'bar',
        data: barData,
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
    animationDurationUpdate: enableAnimation ? updateFrequency : 0,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear',
    graphic: {
      elements: [
        {
          type: 'text',
          right: 60,
          bottom: 60,
          style: {
            text: month,
            font: 'bolder 60px monospace',
            fill: 'rgba(100, 100, 100, 0.25)',
          },
          z: 100,
        },
      ],
    },
  };
};
