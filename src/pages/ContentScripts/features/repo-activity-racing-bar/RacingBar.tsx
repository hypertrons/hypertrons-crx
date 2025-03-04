import { RepoActivityDetails, getOption, countLongTermContributors, DEFAULT_FREQUENCY } from './data';
import { useLoadedAvatars } from './useLoadedAvatars';
import sleep from '../../../../helpers/sleep';

import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle, ForwardedRef } from 'react';
import { Spin } from 'antd';
import * as echarts from 'echarts';
import type { EChartsType } from 'echarts';
import { avatarColorStore } from './AvatarColorStore';
import i18n from '../../../../helpers/i18n';
const t = i18n.t;

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
    const [longTermContributorsCount] = countLongTermContributors(data);

    const maxBars = longTermContributorsCount >= 10 ? 15 : 10;
    const height = longTermContributorsCount >= 10 ? 450 : 300;

    const [currentMonth, setCurrentMonth] = useState(months[months.length - 1]);
    const currentContributors = data[currentMonth]?.map((item) => item[0]) || [];

    const [isLoading, setIsLoading] = useState(false);
    const [loadedAvatars, totalAvatars, loadAvatars] = useLoadedAvatars(currentContributors, currentMonth);

    useEffect(() => {
      const preloadAdjacentMonths = async () => {
        const [year, month] = currentMonth.split('-').map(Number);
        const prevMonth = new Date(year, month - 2, 1);
        const nextMonth = new Date(year, month, 1);
        const prevMonthKey = formatDateToMonthKey(prevMonth);
        const nextMonthKey = formatDateToMonthKey(nextMonth);

        Promise.allSettled([
          avatarColorStore.preloadMonth(
            prevMonthKey,
            data[prevMonthKey]?.map((item) => item[0])
          ),
          avatarColorStore.preloadMonth(
            nextMonthKey,
            data[nextMonthKey]?.map((item) => item[0])
          ),
        ]);
      };
      preloadAdjacentMonths();
    }, [currentMonth]);

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

    const next = async () => {
      pause();
      if (monthIndexRef.current < months.length - 1) {
        setIsLoading(true);
        const instance = echarts.getInstanceByDom(divEL.current!)!;
        monthIndexRef.current++;
        setCurrentMonth(months[monthIndexRef.current]);
        await loadAvatars();
        updateMonth(instance, months[monthIndexRef.current], false);
        setIsLoading(false);
      }
    };

    const previous = async () => {
      pause();
      if (monthIndexRef.current > 0) {
        setIsLoading(true);
        const instance = echarts.getInstanceByDom(divEL.current!)!;
        setCurrentMonth(months[monthIndexRef.current]);
        await loadAvatars();
        monthIndexRef.current--;
        updateMonth(instance, months[monthIndexRef.current], false);
        setIsLoading(false);
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
          spinning={isLoading || loadedAvatars < totalAvatars}
          tip={t('tips_loading_avatars', { currentMonth, loadedAvatars, totalAvatars })}
          // tip={`Loading ${currentMonth} avatars (${loadedAvatars}/${totalAvatars})`}
          style={{ maxHeight: 'none' }}
        >
          <div ref={divEL} style={{ width: '100%', height }} />
        </Spin>
      </div>
    );
  }
);

function formatDateToMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export default RacingBar;
