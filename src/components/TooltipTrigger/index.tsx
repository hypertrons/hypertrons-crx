import React from 'react';
import { ITooltipHostProps, TooltipHost } from 'office-ui-fabric-react';

import { iconTooltipTrigger } from './icon-svg-path';

interface ITooltipTriggerProps extends ITooltipHostProps {
  size?: number;
  iconColor?: string;
  tooltipBackground?: string;
  tooltipFontColor?: string;
}

const TooltipTrigger = ({
  size = 20,
  iconColor = '#FFFFFF',
  tooltipBackground = '#676e72',
  tooltipFontColor = '#FFFFFF',
  ...restProps
}: ITooltipTriggerProps): JSX.Element => (
  <TooltipHost
    tooltipProps={{
      styles: {
        content: { color: tooltipFontColor },
      },
      calloutProps: {
        styles: {
          beak: { backgroundColor: tooltipBackground },
          beakCurtain: { backgroundColor: tooltipBackground },
          calloutMain: { backgroundColor: tooltipBackground, cursor: 'help' },
        },
      },
    }}
    {...restProps}
  >
    <svg
      className="tooltip-icon"
      width={`${size}px`}
      height={`${size}px`}
      viewBox="0 0 48 48"
      version="1.1"
    >
      <path fill={iconColor} d={iconTooltipTrigger}></path>
    </svg>
  </TooltipHost>
);

export default TooltipTrigger;
