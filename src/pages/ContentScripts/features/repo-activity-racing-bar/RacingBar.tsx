import {
  RepoActivityDetails,
  getOption,
  countLongTermContributors,
  DEFAULT_FREQUENCY,
} from './data';
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
import type { EChartsType } from 'echarts';
import { set } from 'lodash-es';

export interface MediaControlers {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  latest: () => void;
  earliest: () => void;
}

interface RacingBarProps {
  speed: number;
  data: RepoActivityDetails;
  setPlaying: (playing: boolean) => void;
}

const RacingBar = forwardRef(
  (
    { speed, data, setPlaying }: RacingBarProps,
    forwardedRef: ForwardedRef<MediaControlers>
  ): JSX.Element => {
    const divEL = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout>();
    const speedRef = useRef<number>(speed);
    speedRef.current = speed;

    const months = Object.keys(data);
    const monthIndexRef = useRef<number>(months.length - 1);

    const [longTermContributorsCount, contributors] =
      countLongTermContributors(data);
    const maxBars = longTermContributorsCount >= 20 ? 20 : 10;
    const height = longTermContributorsCount >= 20 ? 600 : 300;
    const [loadedAvatars, loadAvatars] = useLoadedAvatars(contributors);

    const refreshInstance = () => {
      if (!divEL.current) return;
      let instance = echarts.getInstanceByDom(divEL.current)!;
      if (instance && !instance.isDisposed()) {
        instance.dispose();
      }
      const chartDOM = divEL.current;
      instance = echarts.init(chartDOM);
      return instance;
    };

    const updateMonth = async (instance: EChartsType, month: string) => {
      const option = await getOption(data, month, speedRef.current, maxBars);
      // it seems that hidden bars are also rendered, so when each setOption merge more data into the chart,
      // the fps goes down. So we use notMerge to avoid merging data. But this disables the xAxis animation.
      // Hope we can find a better solution.
      instance.setOption(option, {
        notMerge: true,
      });
    };

    const next = () => {
      if (monthIndexRef.current < months.length - 1) {
        const instance = refreshInstance();
        monthIndexRef.current++;
        instance && updateMonth(instance, months[monthIndexRef.current]);
      }
    };

    const previous = () => {
      if (monthIndexRef.current > 0) {
        const instance = refreshInstance();
        monthIndexRef.current--;
        instance && updateMonth(instance, months[monthIndexRef.current]);
      }
    };

    const latest = () => {
      const instance = refreshInstance();
      monthIndexRef.current = months.length - 1;
      instance && updateMonth(instance, months[monthIndexRef.current]);
    };

    const earliest = () => {
      const instance = refreshInstance();
      monthIndexRef.current = 0;
      instance && updateMonth(instance, months[monthIndexRef.current]);
    };

    const play = async () => {
      if (!divEL.current) return;

      setPlaying(true);

      if (monthIndexRef.current === months.length - 1) {
        earliest();
      }

      const nextMonth = async () => {
        if (!divEL.current) return;
        monthIndexRef.current++;
        const instance = echarts.getInstanceByDom(divEL.current)!;
        await updateMonth(instance, months[monthIndexRef.current]);
        if (monthIndexRef.current < months.length - 1) {
          timerRef.current = setTimeout(
            nextMonth,
            DEFAULT_FREQUENCY / speedRef.current
          );
        } else {
          setTimeout(() => {
            setPlaying(false);
          }, DEFAULT_FREQUENCY / speedRef.current);
        }
      };
      nextMonth();
    };

    const pause = () => {
      setPlaying(false);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };

    // expose startRecording and stopRecording to parent component
    useImperativeHandle(forwardedRef, () => ({
      play,
      pause,
      next,
      previous,
      latest,
      earliest,
    }));

    useEffect(() => {
      (async () => {
        await loadAvatars();
        const instance = refreshInstance();
        instance && updateMonth(instance, months[monthIndexRef.current]);
      })();
    }, []);

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
