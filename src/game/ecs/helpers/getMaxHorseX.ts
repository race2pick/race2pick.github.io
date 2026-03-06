import type { World } from "../world";

export default function getMaxHorseX(world: World) {
  return world.gameConfig.distance + world.constants.horse.startX;
}
