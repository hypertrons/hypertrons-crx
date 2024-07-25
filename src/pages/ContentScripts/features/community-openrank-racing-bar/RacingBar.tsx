import { CommunityOpenRankDetails, getOption, countLongTermItems, DEFAULT_FREQUENCY } from './data';
import sleep from '../../../../helpers/sleep';

import React, { useEffect, useRef, forwardRef, useImperativeHandle, ForwardedRef } from 'react';
import * as echarts from 'echarts';
import type { EChartsType } from 'echarts';

export interface MediaControllers {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  latest: () => void;
  earliest: () => void;
  updateType: (type: string) => void;
}

interface RacingBarProps {
  speed: number;
  data: CommunityOpenRankDetails;
  setPlaying: (playing: boolean) => void;
}

const RacingBar = forwardRef(
  ({ speed, data, setPlaying }: RacingBarProps, forwardedRef: ForwardedRef<MediaControllers>): JSX.Element => {
    const divEL = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout>();
    const speedRef = useRef<number>(speed);
    const openRankRef = useRef<CommunityOpenRankDetails>(data);
    speedRef.current = speed;

    const monthsRef = useRef<string[]>(Object.keys(openRankRef.current));
    const monthIndexRef = useRef<number>(monthsRef.current.length - 1);

    let longTermItemsCount = countLongTermItems(openRankRef.current);

    const maxBarsRef = useRef<number>(longTermItemsCount >= 20 ? 20 : 10);
    const heightRef = useRef<number>(longTermItemsCount >= 20 ? 600 : 300);

    const updateMonth = async (instance: EChartsType, month: string, enableAnimation: boolean) => {
      const option = await getOption(openRankRef.current, month, speedRef.current, maxBarsRef.current, enableAnimation);
      instance.setOption(option);
    };

    const play = async () => {
      const nextMonth = async () => {
        monthIndexRef.current++;
        const instance = echarts.getInstanceByDom(divEL.current!)!;
        updateMonth(instance, monthsRef.current[monthIndexRef.current], true);
        if (monthIndexRef.current < monthsRef.current.length - 1) {
          timerRef.current = setTimeout(nextMonth, DEFAULT_FREQUENCY / speedRef.current);
        } else {
          setTimeout(() => {
            setPlaying(false);
          }, DEFAULT_FREQUENCY / speedRef.current);
        }
      };

      setPlaying(true);
      // if the current month is the latest month, go to the beginning
      if (monthIndexRef.current === monthsRef.current.length - 1) {
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
      if (monthIndexRef.current < monthsRef.current.length - 1) {
        const instance = echarts.getInstanceByDom(divEL.current!)!;
        monthIndexRef.current++;
        updateMonth(instance, monthsRef.current[monthIndexRef.current], false);
      }
    };

    const previous = () => {
      pause();
      if (monthIndexRef.current > 0) {
        const instance = echarts.getInstanceByDom(divEL.current!)!;
        monthIndexRef.current--;
        updateMonth(instance, monthsRef.current[monthIndexRef.current], false);
      }
    };

    const latest = () => {
      pause();
      const instance = echarts.getInstanceByDom(divEL.current!)!;
      monthIndexRef.current = monthsRef.current.length - 1;
      updateMonth(instance, monthsRef.current[monthIndexRef.current], false);
    };

    const earliest = () => {
      const instance = echarts.getInstanceByDom(divEL.current!)!;
      monthIndexRef.current = 0;
      updateMonth(instance, monthsRef.current[monthIndexRef.current], false);
    };

    const getOpenRankByType = (data: CommunityOpenRankDetails, type: string): CommunityOpenRankDetails => {
      if (type === 'a') {
        return data;
      }
      const filteredData: CommunityOpenRankDetails = {};

      for (const [date, nodes] of Object.entries(data)) {
        let typedData = nodes.filter(([_, c]) => c === type);
        if (typedData.length != 0) {
          filteredData[date] = typedData;
        }
      }
      return filteredData;
    };

    const updateType = (type: string) => {
      openRankRef.current = getOpenRankByType(data, type);
      monthsRef.current = Object.keys(openRankRef.current);
      monthIndexRef.current = monthsRef.current.length - 1;

      getOption(
        openRankRef.current,
        monthsRef.current[monthIndexRef.current],
        speedRef.current,
        maxBarsRef.current,
        false
      ).then((newOption) => {
        const instance = echarts.getInstanceByDom(divEL.current!)!;
        instance.setOption(newOption);
      });
    };

    // expose startRecording and stopRecording to parent component
    useImperativeHandle(forwardedRef, () => ({
      play,
      pause,
      next,
      previous,
      latest,
      earliest,
      updateType,
    }));

    useEffect(() => {
      (async () => {
        const instance = echarts.init(divEL.current!);
        updateMonth(instance, monthsRef.current[monthIndexRef.current], false);
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
        <div ref={divEL} style={{ width: '100%', height: heightRef.current }} />
      </div>
    );
  }
);

export default RacingBar;
