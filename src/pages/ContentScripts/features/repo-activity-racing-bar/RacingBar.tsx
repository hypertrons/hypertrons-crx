import { RepoActivityDetails, getOption } from './data';
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

const updateMonth = async (
  instance: EChartsType,
  data: RepoActivityDetails,
  month: string,
  speed: number
) => {
  const option = await getOption(data, month, speed);

  // it seems that hidden bars are also rendered, so when each setOption merge more data into the chart,
  // the fps goes down. So we use notMerge to avoid merging data. But this disables the xAxis animation.
  // Hope we can find a better solution.
  instance.setOption(option, {
    notMerge: true,
  });
};

let timer: NodeJS.Timeout;

const playFromStart = (
  instance: EChartsType,
  data: RepoActivityDetails,
  speed: number
) => {
  const months = Object.keys(data);
  let i = 0;

  const playNext = async () => {
    await updateMonth(instance, data, months[i], speed);
    i++;
    if (i < months.length) {
      timer = setTimeout(playNext, 3000 / speed);
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
      playFromStart(instance, data, speed);
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
