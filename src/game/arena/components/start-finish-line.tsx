import { GREEN_LAND_HEIGHT } from "@/game/static/arena";
import { BlurFilter, Color, NoiseFilter, Texture } from "pixi.js";
import { useMemo } from "react";

export default function StartFinishLine({
  x,
  trackHeight,
}: {
  x: number;
  trackHeight: number;
}) {
  const shadowBlurNoise = useMemo(
    () => [new BlurFilter({ strength: 1 }), new NoiseFilter({ noise: 0.2 })],
    [],
  );

  const texture = Texture.from("start-finish");

  return (
    <pixiTilingSprite
      texture={texture}
      x={x}
      y={GREEN_LAND_HEIGHT}
      width={texture.width / 4}
      height={trackHeight}
      tileScale={{ x: 1 / 4, y: 1 / 4 }}
      alpha={0.6}
      tint={new Color("#aa8b7e2c")}
      filters={shadowBlurNoise}
    />
  );
}
