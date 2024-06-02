import { RepoActivityDetails, getOption, countLongTermContributors, DEFAULT_FREQUENCY } from './data';
import { useLoadedAvatars } from './useLoadedAvatars';
import sleep from '../../../../helpers/sleep';

import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle, ForwardedRef } from 'react';
import { Spin } from 'antd';
import * as echarts from 'echarts';
import type { EChartsType } from 'echarts';

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
  ({ speed, data, setPlaying }: RacingBarProps, forwardedRef: ForwardedRef<MediaControlers>): JSX.Element => {
    const divEL = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout>();
    const speedRef = useRef<number>(speed);
    speedRef.current = speed;

    const months = Object.keys(data);
    const monthIndexRef = useRef<number>(months.length - 1);

    const [longTermContributorsCount, contributors] = countLongTermContributors(data);
    const maxBars = longTermContributorsCount >= 20 ? 20 : 10;
    const height = longTermContributorsCount >= 20 ? 600 : 300;
    const [loadedAvatars, loadAvatars] = useLoadedAvatars(contributors);

    const updateMonth = async (instance: EChartsType, month: string, enableAnimation: boolean) => {
      const option = await getOption(data, month, speedRef.current, maxBars, enableAnimation);
      instance.setOption(option);
    };

    const play = async () => {
      const nextMonth = async () => {
        monthIndexRef.current++;
        const instance = echarts.getInstanceByDom(divEL.current!)!;
        updateMonth(instance, months[monthIndexRef.current], true);
        if (monthIndexRef.current < months.length - 1) {
          timerRef.current = setTimeout(nextMonth, DEFAULT_FREQUENCY / speedRef.current);
        } else {
          setTimeout(() => {
            setPlaying(false);
          }, DEFAULT_FREQUENCY / speedRef.current);
        }
      };

      setPlaying(true);
      // if the current month is the latest month, go to the beginning
      if (monthIndexRef.current === months.length - 1) {
        earliest();
        await sleep(DEFAULT_FREQUENCY / speedRef.current);
      }
      nextMonth();
    };

    const pause = () => {
      setPlaying(false);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };

    const next = () => {
      pause();
      if (monthIndexRef.current < months.length - 1) {
        const instance = echarts.getInstanceByDom(divEL.current!)!;
        monthIndexRef.current++;
        updateMonth(instance, months[monthIndexRef.current], false);
      }
    };

    const previous = () => {
      pause();
      if (monthIndexRef.current > 0) {
        const instance = echarts.getInstanceByDom(divEL.current!)!;
        monthIndexRef.current--;
        updateMonth(instance, months[monthIndexRef.current], false);
      }
    };

    const latest = () => {
      pause();
      const instance = echarts.getInstanceByDom(divEL.current!)!;
      monthIndexRef.current = months.length - 1;
      updateMonth(instance, months[monthIndexRef.current], false);
    };

    const earliest = () => {
      const instance = echarts.getInstanceByDom(divEL.current!)!;
      monthIndexRef.current = 0;
      updateMonth(instance, months[monthIndexRef.current], false);
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
        const instance = echarts.init(divEL.current!);
        updateMonth(instance, months[monthIndexRef.current], false);
      })();

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        const instance = echarts.getInstanceByDom(divEL.current!);
        if (instance && !instance.isDisposed()) {
          instance.dispose();
        }
      };
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
