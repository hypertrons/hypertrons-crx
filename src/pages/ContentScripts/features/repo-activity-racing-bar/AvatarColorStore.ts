// @ts-ignore - TS7016: Could not find a declaration file for module 'colorthief'.
import ColorThief from 'colorthief';

/**
 * @class AvatarColorStore.ts
 * @description Store the dominant color of the user avatars
 */
class AvatarColorStore {
  private static instance: AvatarColorStore;
  private colorThief = new ColorThief();
  private colorCache = new Map<string, string>();

  private loadAvatar(loginId: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = `https://avatars.githubusercontent.com/${loginId}?s=48&v=4`;
    });
  }

  public async getColor(loginId: string): Promise<string> {
    if (!this.colorCache.has(loginId)) {
      const color = await this.loadAvatar(loginId)
        .then((img) => this.colorThief.getColor(img))
        .then((rgb) => `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
      this.colorCache.set(loginId, color);
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
