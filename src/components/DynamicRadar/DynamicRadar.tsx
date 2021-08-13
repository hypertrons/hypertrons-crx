import React, { useEffect, useState, useRef } from 'react';
import { Stack } from '@fluentui/react';
import Radar from './Radar/Radar';
import SimpleTable from './SimpleTable/SimpleTable';
import ControlBar from './ControlBar/ControlBar';

const LEFT_TOP_WIDTH_PERCENT = '70%';
const RIGHT_TOP_WIDTH_PERCENT = '30%';
const TOP_HEIGHT_PERCENT = 0.9;

interface DynamicRadarDataItem {
  date: string;
  values: number[];
}

interface DynamicRadarProps {
  theme: 'light' | 'dark';
  width: number;
  height: number;
  indicators: string[];
  data: DynamicRadarDataItem[];
}

const DynamicRadar: React.FC<DynamicRadarProps> = (props) => {
  const { theme, width, height, indicators, data } = props;
  const [idx, setIdx] = useState(0);
  const timer: { current: NodeJS.Timeout | null } = useRef(null);
  const maxScales = findMaxScales(indicators, data);

  const tick = () => {
    setIdx((idx) => (idx + 1 > data.length - 1 ? 0 : idx + 1));
  };

  const play = () => {
    clearInterval(timer.current as NodeJS.Timeout);
    timer.current = setInterval(tick, 500);
  };

  const pause = () => {
    clearInterval(timer.current as NodeJS.Timeout);
  };

  useEffect(() => {
    console.log('DynamicRadar (re)rendered!');
  });

  return (
    <Stack verticalAlign="space-evenly" styles={{ root: { width, height } }}>
      <Stack horizontal>
        <div
          style={{
            width: LEFT_TOP_WIDTH_PERCENT,
            height: TOP_HEIGHT_PERCENT * height,
          }}
        >
          <Radar
            {...{
              theme,
              height: TOP_HEIGHT_PERCENT * height,
              indicators,
              maxScales,
              values: data[idx].values,
            }}
          />
        </div>
        <Stack
          verticalAlign="space-evenly"
          styles={{
            root: {
              width: RIGHT_TOP_WIDTH_PERCENT,
              height: TOP_HEIGHT_PERCENT * height,
            },
          }}
        >
          <SimpleTable
            {...{
              theme: theme,
              title: data[idx].date,
              keys: indicators,
              values: data[idx].values,
            }}
          />
        </Stack>
      </Stack>
      <ControlBar
        theme={theme}
        play={play}
        pause={pause}
        setIndex={setIdx}
        sliderValue={idx}
        sliderMax={data.length - 1}
      />
    </Stack>
  );
};

const findMaxScales = (indicators: string[], data: DynamicRadarDataItem[]) => {
  let maxScales = new Array(indicators.length).fill(0);
  data.forEach((item) => {
    let values = item.values;
    for (let i = 0; i < indicators.length; i++) {
      if (values[i] > maxScales[i]) {
        maxScales[i] = values[i];
      }
    }
  });
  return maxScales.map((v) => Math.ceil(v * 1.1));
};

export default DynamicRadar;
