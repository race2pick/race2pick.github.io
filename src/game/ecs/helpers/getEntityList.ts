import type { World } from "../world";

export default function getEntityList(world: World) {
  return {
    position: world.position,
    velocity: world.velocity,
    meta: world.meta,
    animation: world.animation,
  };
}
