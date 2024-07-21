import React from 'react';
import { Tooltip } from 'antd';
import { iconTooltipTrigger } from './icon-svg-path';

interface ITooltipTriggerProps {
  size?: number;
  iconColor?: string;
  tooltipBackground?: string;
  tooltipFontColor?: string;
  content?: string;
}

const TooltipTrigger: React.FC<ITooltipTriggerProps> = ({
  size = 20,
  iconColor = '#FFFFFF',
  tooltipBackground = '#FFFFFF',
  tooltipFontColor = '#242A2E',
  content,
}) => (
  <Tooltip placement="top" title={<span style={{ color: tooltipFontColor }}>{content}</span>} color={tooltipBackground}>
    <svg className="tooltip-icon" width={`${size}px`} height={`${size}px`} viewBox="0 0 48 48" version="1.1">
      <path fill={iconColor} d={iconTooltipTrigger}></path>
    </svg>
  </Tooltip>
);

export default TooltipTrigger;
