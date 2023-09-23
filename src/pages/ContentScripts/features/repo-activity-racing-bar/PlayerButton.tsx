import React from 'react';
import { Button, Tooltip } from 'antd';

interface PlayerButtonProps {
  tooltip?: string;
  icon: JSX.Element;
  onClick?: () => void;
  onDoubleClick?: () => void;
}

export const PlayerButton = ({
  tooltip,
  icon,
  onClick,
  onDoubleClick,
}: PlayerButtonProps): JSX.Element => {
  return (
    <Tooltip
      style={{ visibility: tooltip ? 'visible' : 'hidden' }}
      title={tooltip}
      mouseEnterDelay={1}
    >
      <Button
        style={{ backgroundColor: 'var(--color-btn-bg)' }}
        styles={{ icon: { color: 'var(--color-btn-text)' } }}
        icon={icon}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      />
    </Tooltip>
  );
};
