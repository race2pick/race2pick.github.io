import { useTrackLength } from "@/game/hooks/useTrackLength";
import { GRASS_GAP, GREEN_LAND_HEIGHT } from "@/game/static/arena";
import { GRASS_ALIASES } from "@/game/static/assets";
import { Texture } from "pixi.js";
import { useMemo } from "react";

export default function Grass() {
  const { trackLengthWithBuffer } = useTrackLength();

  const grassItems = useMemo(() => {
    const items: { alias: string; x: number; scale: number }[] = [];
    let x = GRASS_GAP;
    const containerWidth = trackLengthWithBuffer;

    while (x < containerWidth) {
      const alias =
        GRASS_ALIASES[Math.floor(Math.random() * GRASS_ALIASES.length)];
      const texture = Texture.from(alias);
      const scale = GREEN_LAND_HEIGHT / texture.height;
      const scaledWidth = texture.width * scale;
      items.push({
        alias,
        x,
        scale,
      });
      x += scaledWidth + GRASS_GAP;
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
          y={GREEN_LAND_HEIGHT}
          scale={item.scale}
          anchor={{ x: 0, y: 1 }}
        />
      ))}
    </>
  );
}
