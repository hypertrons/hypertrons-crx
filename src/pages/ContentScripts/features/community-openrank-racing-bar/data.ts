import getGithubTheme from '../../../../helpers/get-github-theme';

import type { BarSeriesOption, EChartsOption } from 'echarts';
import { orderBy, take } from 'lodash-es';

const theme = getGithubTheme();
const DARK_TEXT_COLOR = 'rgba(230, 237, 243, 0.9)';

export interface CommunityOpenRankDetails {
  // e.g. 2020-05: [["frank-zsy", 4.69], ["heming6666", 3.46], ["menbotics[bot]", 2]]
  [key: string]: [string, string, number][];
}

/**
 * Filter and extract monthly data from the given data structure, which includes various date formats such as "yyyy", "yyyy-Qq", and "yyyy-mm".
 * This function extracts and returns only the monthly data in the "yyyy-mm" format.
 *
 * @returns CommunityOpenRankDetails
 * @param data
 */
export function getMonthlyData(data: CommunityOpenRankDetails) {
  const monthlyData: CommunityOpenRankDetails = {};

  for (const key in data) {
    // Check if the key matches the yyyy-mm format (e.g., "2020-05")
    if (/^\d{4}-\d{2}$/.test(key)) {
      monthlyData[key] = data[key];
    }
  }
  return monthlyData;
}

/**
 * Count the number of unique contributors in the data
 * @returns [number of long term contributors, contributors' names]
 */
export const countLongTermContributors = (data: CommunityOpenRankDetails): [number, string[]] => {
  const map = new Map<string, number>();
  Object.keys(data).forEach((month) => {
    data[month].forEach((item) => {
      if (map.has(item[0])) {
        map.set(item[0], map.get(item[0])! + 1);
      } else {
        map.set(item[0], 0);
      }
    });
  });
  let count = 0;
  map.forEach((value) => {
    // only count map who have contributed more than 3 months
    if (value >= 3) {
      count++;
    }
  });
  return [count, [...map.keys()]];
};

export const DEFAULT_FREQUENCY = 2000;

/**
 * get the echarts option with the given data, month and speed.
 */
export const getOption = async (
  data: CommunityOpenRankDetails,
  month: string,
  speed: number,
  maxBars: number,
  enableAnimation: boolean
): Promise<EChartsOption> => {
  const updateFrequency = DEFAULT_FREQUENCY / speed;
  const rich: any = {};
  const sortedData = orderBy(data[month], (item) => item[1], 'desc');
  const topData = take(sortedData, maxBars);
  const colorMap = new Map([
    ['r', '#72a8d6'],
    ['i', '#98F8DD'],
    ['p', '#F2FF7F'],
    ['u', '#f8a8ab'],
  ]);
  const barData: BarSeriesOption['data'] = await Promise.all(
    topData.map(async (item) => {
      let color = <string>colorMap.get(item[1]);
      return {
        value: [item[0], item[2]],
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
                color: 'white',
              },
              {
                offset: 0.5,
                color: color,
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
      axisLabel: {
        show: true,
        color: theme === 'light' ? undefined : DARK_TEXT_COLOR,
      },
    },
    yAxis: {
      type: 'category',
      inverse: true,
      max: maxBars,
      axisLabel: {
        show: true,
        color: theme === 'light' ? undefined : DARK_TEXT_COLOR,
        fontSize: 14,
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
          color: theme === 'light' ? undefined : DARK_TEXT_COLOR,
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
            fill: theme === 'light' ? 'rgba(100, 100, 100, 0.3)' : DARK_TEXT_COLOR,
          },
          z: 100,
        },
      ],
    },
  };
};
