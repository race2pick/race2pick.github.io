import type { World } from "@/game/ecs/world";
import type { Render } from "@/game/renders/types";
import renderAnimations from "./render-animation";
import renderPosition from "./render-position";
import renderCamera from "./render-camera";

export default function renderSystem(world: World, render: Render) {
  if (!world || !render) {
    return;
  }

  renderAnimations(world, render);
  renderPosition(world, render);
  renderCamera(world, render);
}
