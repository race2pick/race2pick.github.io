import type { World } from "@/game/ecs/world";
import { getTrackLengthWithBuffer } from "./arena.render";
import { FillGradient, Graphics } from "pixi.js";
import { GREEN_LAND_HEIGHT } from "@/game/static/arena";

export default function createLand(world: World) {
  const trackLengthWithBuffer = getTrackLengthWithBuffer(world);

  const ground = new Graphics();
  const groundGrass = new Graphics();
  const faded = new Graphics();

  const groudGradient = new FillGradient({
    type: "linear",
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    colorStops: [
      {
        offset: 0,
        color: "#8b5a2b",
      },
      {
        offset: 0.7,
        color: "#704321",
      },
      {
        offset: 1,
        color: "#5c3220",
      },
    ],
  });

  const grassGradient = new FillGradient({
    type: "linear",
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    colorStops: [
      {
        offset: 0,
        color: "#47c45a",
      },
      {
        offset: 0.7,
        color: "#379a47",
      },
      {
        offset: 1,
        color: "#379a47",
      },
    ],
  });

  const fadedGradient = new FillGradient({
    type: "linear",
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
    colorStops: [
      {
        offset: 0,
        color: "#4C5F3100",
      },
      {
        offset: 0.5,
        color: "#4C5F31",
      },
      {
        offset: 1,
        color: "#000000",
      },
    ],
  });

  ground
    .clear()
    .rect(0, 0, trackLengthWithBuffer, world.screen.height)
    .fill(groudGradient);

  groundGrass
    .clear()
    .rect(0, 0, trackLengthWithBuffer, GREEN_LAND_HEIGHT)
    .fill(grassGradient);

  faded
    .clear()
    .rect(0, world.screen.height - 15, trackLengthWithBuffer, 15)
    .fill(fadedGradient);

  return { ground: [ground, groundGrass], faded };
}
