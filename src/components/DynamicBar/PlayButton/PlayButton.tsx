import React from 'react';
import { initializeIcons, IconButton } from '@fluentui/react';

initializeIcons();

interface PlayButtonProps {
  hide: boolean;
  theme: 'light' | 'dark';
  size: number;
  play: any;
}

const PlayButton: React.FC<PlayButtonProps> = (props) => {
  const { hide, theme, size, play } = props;

  if (hide) return null;

  return (
    <div>
      <IconButton
        iconProps={{
          iconName: false ? 'CirclePauseSolid' : 'MSNVideosSolid',
        }}
        styles={{
          root: {
            position: 'absolute',
            width: size,
            height: size,
            left: 20,
            bottom: 20,
            borderRadius: '100%',
          },
          icon: {
            color: theme == 'light' ? 'black' : 'white',
            fontSize: size,
          },
          rootHovered: {
            background: 'transparent',
          },
        }}
        onClick={play}
      />
    </div>
  );
};
export default PlayButton;
