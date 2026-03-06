import type { World } from "@/game/ecs/world";
import createLand from "./createLand";
import createGrasses from "./createGrasses";
import createGrassFaded from "./createGrassFaded";
import createPuddle from "./createPuddle";
import createStartFinishLine from "./createStartFinishLine";
import type { Render } from "../types";

export function getTrackLengthWithBuffer(world: World) {
  return world.gameConfig.distance + world.screen.width;
}

export default function renderArena(world: World, render: Render) {
  const { arena, app } = render;
  const cachedContainers = new Set([
    arena.cache.grasses?.container,
    arena.cache.grassFaded?.container,
    arena.cache.puddles?.container,
  ]);
  arena.container.removeChildren().forEach((c) => {
    if (!cachedContainers.has(c)) c.destroy();
  });

  const {ground, faded} = createLand(world);
  const grasses = createGrasses(world, arena, app.renderer);
  const grassFeded = createGrassFaded(world, arena, app.renderer);
  const puddles = createPuddle(world, arena, app.renderer);

  const startFinishLine = createStartFinishLine(world, arena);

  ground.forEach((g) => arena.container.addChild(g));
  startFinishLine.forEach((s) => arena.container.addChild(s));
  arena.container.addChild(faded);
  arena.container.addChild(grasses);
  arena.container.addChild(grassFeded);
  arena.container.addChild(puddles);
}
