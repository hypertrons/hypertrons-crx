import React from 'react';
import { Segmented, SegmentedProps } from 'antd';

interface SpeedControllerProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

const options: SegmentedProps['options'] = [
  {
    label: '0.5x',
    value: 0.5,
  },
  {
    label: '1x',
    value: 1,
  },
  {
    label: '2x',
    value: 2,
  },
];

export const SpeedController = ({ speed, onSpeedChange }: SpeedControllerProps): JSX.Element => {
  return (
    <Segmented
      style={{
        backgroundColor: 'var(--color-btn-bg)',
        color: 'var(--fgColor-default, var(--color-fg-default))',
      }}
      options={options}
      value={speed}
      onChange={(value) => onSpeedChange(value as number)}
    />
  );
};
