import { avatarColorStore } from './AvatarColorStore';

import { useState } from 'react';

export const useLoadedAvatars = (contributors: string[]): [number, () => void] => {
  const [loadedAvatars, setLoadedAvatars] = useState(0);

  const load = async () => {
    const promises = contributors.map(async (contributor) => {
      await avatarColorStore.getColors(contributor);
      setLoadedAvatars((loadedAvatars) => loadedAvatars + 1);
    });
    await Promise.all(promises);
  };

  return [loadedAvatars, load];
};
