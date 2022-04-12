import React, { useState } from 'react';
import { Stack, Slider, IconButton } from '@fluentui/react';
import {
  IStyleFunctionOrObject,
  ISliderStyleProps,
  ISliderStyles,
} from '@fluentui/react';

interface ControlBarProps {
  theme: 'light' | 'dark';
  play: Function;
  pause: Function;
  setIndex: Function;
  sliderValue: number;
  sliderMax: number;
}

const ControlBar: React.FC<ControlBarProps> = (props) => {
  const { theme, play, pause, setIndex, sliderValue, sliderMax } = props;
  const [ifPlay, setIfPlay] = useState(false);

  const sliderStyle: IStyleFunctionOrObject<ISliderStyleProps, ISliderStyles> =
    {
      thumb: {
        background: theme == 'light' ? 'darkblue' : '#58a6ff',
        borderRadius: 0,
        height: '14px',
        top: '-5px',
        width: '6px',
        borderWidth: '0px',
      },
      activeSection: {
        background: theme == 'light' ? 'rgb(200, 198, 196)' : '#58a6ff',
      },
      inactiveSection: {
        background: theme == 'light' ? 'rgb(237, 235, 233)' : 'white',
      },
    };

  const previous = () => {
    setIndex((idx: number) => (idx - 1 < 0 ? 0 : idx - 1));
  };

  const next = () => {
    setIndex((idx: number) => (idx + 1 > sliderMax ? sliderMax : idx + 1));
  };

  return (
    <div style={{ width: '91%', marginLeft: '9%' }}>
      <Stack horizontal>
        <IconButton
          iconProps={{
            iconName: ifPlay ? 'CirclePauseSolid' : 'MSNVideosSolid',
          }}
          styles={{
            icon: { color: theme == 'light' ? 'darkblue' : '#58a6ff' },
          }}
          onClick={() => {
            ifPlay ? pause() : play();
            setIfPlay(!ifPlay);
          }}
        />
        <IconButton
          iconProps={{ iconName: 'ChevronLeftSmall' }}
          styles={{
            icon: { color: theme == 'light' ? 'darkblue' : '#58a6ff' },
          }}
          onClick={previous}
        />
        <Stack.Item grow align="center">
          <Slider
            styles={sliderStyle}
            min={0}
            max={sliderMax}
            step={1}
            value={sliderValue}
            showValue={false}
            snapToStep
            onChange={(value) => setIndex(value)}
          />
        </Stack.Item>
        <IconButton
          iconProps={{ iconName: 'ChevronRightSmall' }}
          styles={{
            icon: { color: theme == 'light' ? 'darkblue' : '#58a6ff' },
          }}
          onClick={next}
        />
      </Stack>
    </div>
  );
};

export default ControlBar;
