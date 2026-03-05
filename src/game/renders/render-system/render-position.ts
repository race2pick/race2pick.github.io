import type { World } from "@/game/ecs/world";
import type { Render } from "../types";

export default function renderPosition(world: World, render: Render) {
  world.position.forEach((position, entityId) => {
    const horseView = render.horseView.horse.get(entityId);
    if (!horseView) {
      return;
    }

    horseView.container.x = position.x;
    horseView.container.y = position.y;
  });
}
