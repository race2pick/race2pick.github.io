import { Assets, type Texture } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { HORSE_ASSETS } from "../static/horse";

export const useAssets = () => {
  const [textures, setTextures] = useState<Texture[]>([]);
  const [texturesIdle, setTexturesIdle] = useState<Texture[]>([]);
  const isLoaded = useRef(false);

  useEffect(() => {
    const load = async () => {
      const spritesheet = await Assets.load({
        alias: HORSE_ASSETS.horse,
        src: "./horse-sprites.json",
      });
      const frames = Object.values(spritesheet.textures) as Texture[];

      setTextures(frames);

      const spritesheetIdle = await Assets.load({
        alias: HORSE_ASSETS["horse-idle"],
        src: "./horse-idle-sprites.json",
      });

      const framesIdle = Object.values(spritesheetIdle.textures) as Texture[];

      setTexturesIdle(framesIdle);
      isLoaded.current = true;
    };

    if (!isLoaded.current) {
      load();
    } else {
      const spritesheet = Assets.get("horse");
      const spritesheetIdle = Assets.get("horse-idle");
      setTextures(Object.values(spritesheet.textures) as Texture[]);
      setTexturesIdle(Object.values(spritesheetIdle.textures) as Texture[]);
    }
  }, []);

  return { textures, texturesIdle };
};
