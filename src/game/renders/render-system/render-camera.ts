import type { World } from "@/game/ecs/world";
import type { Render } from "../types";

export default function renderCamera(world: World, render: Render) {
  if (!world || !render) {
    return;
  }

  render.arena.camera.pivot.x = world.camera.pivotX;
}
