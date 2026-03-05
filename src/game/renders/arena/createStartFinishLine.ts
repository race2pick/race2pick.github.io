import type { World } from "@/game/ecs/world";
import { BlurFilter, Color, NoiseFilter, TilingSprite } from "pixi.js";
import { HORSE_WIDTH } from "@/game/static/horse";
import { GREEN_LAND_HEIGHT } from "@/game/static/arena";
import type { Render } from "../types";

const colorTint = new Color("#aa8b7e2c");
const blurFilter = new BlurFilter({ strength: 1 });
const noiseFilter = new NoiseFilter({ noise: 0.2 });

export default function createStartFinishLine(
  world: World,
  arena: Render["arena"],
) {
  const startLine = new TilingSprite({
    texture: arena.testures.startFinishLine,
    x: world.constants.horse.startX + HORSE_WIDTH - 70,
    y: GREEN_LAND_HEIGHT,
    width: arena.testures.startFinishLine.width / 4,
    height: world.screen.height,
    tileScale: { x: 1 / 4, y: 1 / 4 },
    alpha: 0.6,
    tint: colorTint,
    filters: [blurFilter, noiseFilter],
  });

  const finishLine = new TilingSprite({
    texture: arena.testures.startFinishLine,
    x: world.gameConfig.distance + HORSE_WIDTH,
    y: GREEN_LAND_HEIGHT,
    width: arena.testures.startFinishLine.width / 4,
    height: world.screen.height,
    tileScale: { x: 1 / 4, y: 1 / 4 },
    alpha: 0.6,
    tint: colorTint,
    filters: [blurFilter, noiseFilter],
  });

  return [startLine, finishLine];
}
