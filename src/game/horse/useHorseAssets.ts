import { Assets, type Texture } from "pixi.js";
import { useEffect, useState } from "react";

export const useHorseAssets = () => {
  const [textures, setTextures] = useState<Texture[]>([]);
  const [texturesIdle, setTexturesIdle] = useState<Texture[]>([]);

  useEffect(() => {
    const spritesheet = Assets.get("horse");
    const spritesheetIdle = Assets.get("horse-idle");
    setTextures(Object.values(spritesheet.textures) as Texture[]);
    setTexturesIdle(Object.values(spritesheetIdle.textures) as Texture[]);
  }, []);

  return { textures, texturesIdle };
};
