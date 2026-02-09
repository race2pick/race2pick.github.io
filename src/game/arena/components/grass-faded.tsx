import { useTrackLength } from "@/game/hooks/useTrackLength";
import { GRASS_FADED_ALIASES } from "@/game/static/assets";
import { Texture } from "pixi.js";
import { useMemo } from "react";

export default function GrassFaded() {
  const { trackLengthWithBuffer } = useTrackLength();

  const grassItems = useMemo(() => {
    const TARGET_HEIGHT = 10;

    const items: { alias: string; x: number; scale: number }[] = [];

    let x = 0;
    const containerWidth = trackLengthWithBuffer;

    while (x < containerWidth) {
      const alias =
        GRASS_FADED_ALIASES[
          Math.floor(Math.random() * GRASS_FADED_ALIASES.length)
        ];
      const texture = Texture.from(alias);
      const scale = TARGET_HEIGHT / texture.height;
      const scaledWidth = texture.width * scale;
      items.push({
        alias,
        x,
        scale,
      });
      x += scaledWidth;
    }

    return items;
  }, [trackLengthWithBuffer]);

  return (
    <>
      {grassItems.map((item, index) => (
        <pixiSprite
          key={index}
          texture={Texture.from(item.alias)}
          x={item.x}
          y={24}
          scale={item.scale}
          anchor={{ x: 0, y: 0 }}
          alpha={0.3}
        />
      ))}
    </>
  );
}
