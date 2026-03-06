import type { World } from "../world";

export default function winnerSystem(world: World) {
  if (world.gameState !== "started" || world.winner) return;

  const finishX = world.gameConfig.distance + world.constants.horse.width / 1.7;

  for (const [, entityId] of world.horses) {
    if (world.winner) {
      break;
    }

    const position = world.position.get(entityId);

    if (!position) {
      continue;
    }

    if (position.x >= finishX) {
      world.setWinner(entityId);
      world.setGameState("finished");

      const position = world.position.get(entityId);

      if (position) {
        position.x += 6;
      }
      break;
    }
  }

  if (world.winner) {
    for (const [, entityId] of world.horses) {
      if (world.winner === entityId) continue;

      const position = world.position.get(entityId);
      if (!position) continue;

      position.x -= 5;
    }
  }
}
