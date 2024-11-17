import React, { useRef } from 'react';
import { Button, Tooltip } from 'antd';

interface PlayerButtonProps {
  tooltip?: string;
  icon: JSX.Element;
  onClick?: () => void;
  onLongPress?: () => void;
}

export const PlayerButton = ({ tooltip, icon, onClick, onLongPress }: PlayerButtonProps): JSX.Element => {
  const pressingRef = useRef(false);
  const longPressDetectedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout>();

  const handleMouseDown = () => {
    pressingRef.current = true;
    timerRef.current = setTimeout(() => {
      if (pressingRef.current) {
        longPressDetectedRef.current = true;
        onLongPress?.();
      }
    }, 1000);
  };

  const handleMouseUp = () => {
    clearTimeout(timerRef.current!);
    pressingRef.current = false;

    if (longPressDetectedRef.current) {
      longPressDetectedRef.current = false;
      return;
    }

    onClick?.();
  };

  return (
    <Tooltip style={{ visibility: tooltip ? 'visible' : 'hidden' }} title={tooltip} mouseEnterDelay={1}>
      <Button
        style={{ backgroundColor: 'var(--color-btn-bg)' }}
        styles={{
          icon: { color: 'var(--fgColor-default, var(--color-fg-default))' },
        }}
        icon={icon}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </Tooltip>
  );
};
