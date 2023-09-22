import { RepoActivityDetails } from '.';
import { avatarColorStore } from './AvatarColorStore';

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

export interface RecordingHandlers {
  startRecording: () => void;
  stopRecording: () => void;
}

interface RacingBarProps {
  repoName: string;
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
 * @returns [number of long term contributors, contributors' names]
 */
const countLongTermContributors = (
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

const RacingBar = forwardRef(
  (
    { data }: RacingBarProps,
    forwardedRef: ForwardedRef<RecordingHandlers>
  ): JSX.Element => {
    const [loadedAvatars, setLoadedAvatars] = useState(0);
    const divEL = useRef<HTMLDivElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    let height = 300;
    const [longTermContributorsCount, contributors] =
      countLongTermContributors(data);
    if (longTermContributorsCount >= 20) {
      // @ts-ignore
      option.yAxis.max = 20;
      height = 600;
    }

    useEffect(() => {
      (async () => {
        if (!divEL.current) return;

        const chartDOM = divEL.current;
        const instance = echarts.init(chartDOM);

        // load avatars and extract colors before playing the chart
        const promises = contributors.map(async (contributor) => {
          await avatarColorStore.getColors(contributor);
          setLoadedAvatars((loadedAvatars) => loadedAvatars + 1);
        });
        await Promise.all(promises);

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
      })();
    }, []);

    const startRecording = () => {
      if (!divEL.current) return;

      console.log('start record');
      // Start the media recorder
      const canvas: HTMLCanvasElement =
        divEL.current.querySelector('div > canvas')!;
      const stream = canvas.captureStream(60);
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/mp4',
      });

      mediaRecorderRef.current.ondataavailable = function (event) {
        chunksRef.current.push(event.data);
      };

      // Start recording
      mediaRecorderRef.current.start();
    };

    const stopRecording = () => {
      if (!mediaRecorderRef.current) return;

      console.log('stop record');
      // Handle the stop event
      mediaRecorderRef.current.onstop = function () {
        const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);

        // Create a video element and set the source to the recorded video
        const video = document.createElement('video');
        video.src = url;

        // Download the video
        const a = document.createElement('a');
        a.download = 'chart_animation.mp4';
        a.href = url;
        a.click();

        // Clean up
        URL.revokeObjectURL(url);
        chunksRef.current = [];
      };
      mediaRecorderRef.current.stop();
    };

    // expose startRecording and stopRecording to parent component
    useImperativeHandle(forwardedRef, () => ({
      startRecording,
      stopRecording,
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
