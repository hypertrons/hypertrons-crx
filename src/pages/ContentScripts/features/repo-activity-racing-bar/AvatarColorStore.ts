// @ts-ignore - TS7016: Could not find a declaration file for module 'colorthief'.
import ColorThief from 'colorthief';

type Color = string;
type RGB = [number, number, number];
interface ColorCache {
  [month: string]: {
    [loginId: string]: {
      colors: Color[];
      lastUpdated: number;
    };
  };
}

/** The number determines how many colors are extracted from the image */
const COLOR_COUNT = 2;
/** The number determines how many pixels are skipped before the next one is sampled.  */
const COLOR_QUALITY = 1;
/** The number determines how long the cache is valid.  */
const CACHE_EXPIRE_TIME = 1000 * 60 * 60 * 24 * 7;

/**
 * A singleton class that stores the avatar colors of users.
 */
class AvatarColorStore {
  private static instance: AvatarColorStore;
  private colorThief = new ColorThief();

  private loadAvatar(loginId: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = `https://avatars.githubusercontent.com/${loginId}?s=8&v=4`;
    });
  }
  private cache: ColorCache = {};

  public async getColors(month: string, loginId: string): Promise<Color[]> {
    const now = Date.now();

    if (this.cache[month]?.[loginId] && now - this.cache[month][loginId].lastUpdated < CACHE_EXPIRE_TIME) {
      return this.cache[month][loginId].colors;
    }

    try {
      const img = await this.loadAvatar(loginId);
      const rgbs = await this.colorThief.getPalette(img, COLOR_COUNT, COLOR_QUALITY);
      const colors = rgbs.map((rgb: RGB) => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);

      if (!this.cache[month]) this.cache[month] = {};
      this.cache[month][loginId] = { colors, lastUpdated: now };
      return colors;
    } catch (error) {
      return Array(COLOR_COUNT).fill('rgb(255, 255, 255)');
    }
  }
  public async preloadMonth(month: string, contributors: string[]) {
    if (!contributors) return;
    contributors.forEach((contributor) => {
      this.getColors(month, contributor).catch(() => {});
    });
  }

  public static getInstance(): AvatarColorStore {
    if (!AvatarColorStore.instance) {
      AvatarColorStore.instance = new AvatarColorStore();
    }
    return AvatarColorStore.instance;
  }
}

export const avatarColorStore = AvatarColorStore.getInstance();
