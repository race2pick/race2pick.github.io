import { Assets, type Texture } from "pixi.js";

let cachedTextures: Texture[] | null = null;
let cachedTexturesIdle: Texture[] | null = null;

export const useHorseAssets = () => {
  if (!cachedTextures || !cachedTexturesIdle) {
    const spritesheet = Assets.get("horse");
    const spritesheetIdle = Assets.get("horse-idle");
    cachedTextures = Object.values(spritesheet.textures) as Texture[];
    cachedTexturesIdle = Object.values(spritesheetIdle.textures) as Texture[];
  }

  return { textures: cachedTextures, texturesIdle: cachedTexturesIdle };
};
