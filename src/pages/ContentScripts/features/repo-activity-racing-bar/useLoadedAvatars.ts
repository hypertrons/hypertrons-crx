import { avatarColorStore } from './AvatarColorStore';

import { useEffect, useState } from 'react';

export const useLoadedAvatars = (contributors: string[], month: string): [number, number, () => void] => {
  const [loadedCount, setLoadedCount] = useState(0);
  const totalAvatarCount = contributors.length;

  const load = async () => {
    setLoadedCount(0);

    await Promise.all(
      contributors.map(async (contributor) => {
        try {
          await avatarColorStore.getColors(month, contributor);
          setLoadedCount((prev) => prev + 1);
        } catch (error) {
          setLoadedCount((prev) => prev + 1);
        }
      })
    );
  };

  useEffect(() => {
    load();
  }, [month]);

  return [loadedCount, totalAvatarCount, load];
};
