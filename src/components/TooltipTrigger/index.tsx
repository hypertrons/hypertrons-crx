import React from 'react';
import { Tooltip } from 'antd';
import { iconTooltipTrigger } from './icon-svg-path';

interface ITooltipTriggerProps {
  size?: number;
  iconColor?: string;
  content?: string;
  overlayClassName?: string;
}

const TooltipTrigger: React.FC<ITooltipTriggerProps> = ({
  size = 20,
  iconColor = '#FFFFFF',
  content,
  overlayClassName = 'custom-tooltip',
}) => (
  <Tooltip placement="top" title={<span>{content}</span>} overlayClassName={overlayClassName}>
    <svg className="tooltip-icon" width={`${size}px`} height={`${size}px`} viewBox="0 0 48 48" version="1.1">
      <path fill={iconColor} d={iconTooltipTrigger}></path>
    </svg>
  </Tooltip>
);

export default TooltipTrigger;
