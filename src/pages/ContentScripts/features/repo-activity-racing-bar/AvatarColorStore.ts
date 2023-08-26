// @ts-ignore - TS7016: Could not find a declaration file for module 'colorthief'.
import ColorThief from 'colorthief';

type LoginId = string;
type Color = string;
type RGB = [number, number, number];

const COLOR_COUNT = 2;
/**
 * The number determines how many pixels are skipped before the next one is sampled.
 */
const COLOR_QUALITY = 1;

/**
 * @class AvatarColorStore.ts
 * @description Store the colors of the user avatars
 */
class AvatarColorStore {
  private static instance: AvatarColorStore;
  private colorThief = new ColorThief();
  private colorCache = new Map<LoginId, Color[]>();

  private loadAvatar(loginId: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = `https://avatars.githubusercontent.com/${loginId}?s=48&v=4`;
    });
  }

  public async getColors(loginId: LoginId): Promise<Color[]> {
    if (!this.colorCache.has(loginId)) {
      let colors: Color[];
      // a single white color causes error: https://github.com/lokesh/color-thief/issues/40#issuecomment-802424484
      try {
        colors = await this.loadAvatar(loginId)
          .then((img) =>
            this.colorThief.getPalette(img, COLOR_COUNT, COLOR_QUALITY)
          )
          .then((rgbs) => {
            return rgbs.map(
              (rgb: RGB) => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
            );
          });
      } catch (error) {
        console.error(
          `Cannot extract colors of the avatar of ${loginId}, error info: `,
          error
        );
        colors = Array(COLOR_COUNT).fill('rgb(255, 255, 255)');
      }
      this.colorCache.set(loginId, colors);
    }
    return this.colorCache.get(loginId)!;
  }

  public static getInstance(): AvatarColorStore {
    if (!AvatarColorStore.instance) {
      AvatarColorStore.instance = new AvatarColorStore();
    }
    return AvatarColorStore.instance;
  }
}

export const avatarColorStore = AvatarColorStore.getInstance();
