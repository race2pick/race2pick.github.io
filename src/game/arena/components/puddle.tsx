import { useTrackLength } from "@/game/hooks/useTrackLength";
import { GREEN_LAND_HEIGHT } from "@/game/static/arena";
import { PUDDLE_ALIASES } from "@/game/static/assets";
import { Texture } from "pixi.js";
import { useMemo } from "react";

export default function Puddle({ trackheight }: { trackheight: number }) {
  const { trackLengthWithBuffer } = useTrackLength();

  const puddleItems = useMemo(() => {
    const area = trackLengthWithBuffer * trackheight;
    const cellCount = Math.floor(area / 30000);
    const puddlesPerCell = 3 + Math.floor(Math.random() * 3); // 3, 4, or 5
    const totalPuddles = cellCount * puddlesPerCell;

    const items: {
      alias: string;
      x: number;
      y: number;
      scale: number;
    }[] = [];

    for (let i = 0; i < totalPuddles; i++) {
      const alias =
        PUDDLE_ALIASES[Math.floor(Math.random() * PUDDLE_ALIASES.length)];
      const scale = 0.05 + Math.random() * 0.3; // 0.05 to 0.35

      const x = Math.random() * trackLengthWithBuffer;
      const y =
        GREEN_LAND_HEIGHT + Math.random() * (trackheight - GREEN_LAND_HEIGHT);

      items.push({ alias, x, y, scale });
    }

    return items;
  }, [trackLengthWithBuffer, trackheight]);

  return (
    <>
      {puddleItems.map((item, index) => (
        <pixiSprite
          key={index}
          texture={Texture.from(item.alias)}
          x={item.x}
          y={item.y}
          scale={{ x: item.scale, y: item.scale / 2 }}
          anchor={0.5}
          alpha={0.5}
        />
      ))}
    </>
  );
}
