import type { HorseEntity } from "@/game/ecs/entities/horse";
import type { HorseTag, Meta } from "@/game/ecs/components";
import { HORSE_COLORS, HORSE_START_X } from "@/game/static/horse";
import { createRandomCycle, randomMinMax } from "@/game/utils/common";
import type { World } from "../world";
import { createEntity } from "./entity";
import type { EntityId } from "../entities/entity";

const getHorseColor = createRandomCycle(HORSE_COLORS);

export function createHorseEntity({
  name,
  index,
  y,
}: {
  name: HorseTag["name"];
  index: number;
  y: number;
}): HorseEntity {
  return {
    position: { x: HORSE_START_X, y },
    velocity: { current: 0, target: 0, elapsed: 0 },
    tag: { name, color: getHorseColor() ?? HORSE_COLORS[0], index },
    sprite: { animSpeed: randomMinMax(0.05, 0.5), isIdle: true },
  };
}

export function calculateHorseGap(world: World, playerLength: number) {
  const horseMaxY = world.screen.height - world.constants.horse.height / 1.25;
  return horseMaxY / (playerLength + 1);
}

export function createHorse(
  world: World,
  {
    name,
    index,
    playerLength,
  }: {
    name: Meta["name"];
    index: number;
    playerLength: number;
  },
) {
  const entityId = createEntity();

  const horseGap = calculateHorseGap(world, playerLength);

  world.horses.set(name, entityId);

  world.meta.set(entityId, {
    name,
    color: getHorseColor() ?? HORSE_COLORS[0],
    index,
  });

  world.position.set(entityId, {
    x: world.constants.horse.startX,
    y: (index + 1) * horseGap + world.constants.horse.height / 4,
  });

  world.velocity.set(entityId, {
    current: 0,
    target: randomMinMax(world.gameConfig.speedMin, world.gameConfig.speedMax),
    elapsed: 0,
  });

  world.animation.set(entityId, {
    name: "idle",
    speed: randomMinMax(
      world.constants.horse.animation.idle.minSpeed,
      world.constants.horse.animation.idle.maxSpeed,
    ),
    elapsed: 0,
  });
}

export function updateHorse(
  world: World,
  entityId: EntityId,
  {
    name,
    index,
    playerLength,
  }: { name: Meta["name"]; index: number; playerLength: number },
) {
  const horseGap = calculateHorseGap(world, playerLength);

  world.horses.set(name, entityId);

  world.position.set(entityId, {
    x: world.constants.horse.startX,
    y: (index + 1) * horseGap + world.constants.horse.height / 4,
  });

  const meta = world.meta.get(entityId);
  if (meta) {
    meta.index = index;
  }
}
