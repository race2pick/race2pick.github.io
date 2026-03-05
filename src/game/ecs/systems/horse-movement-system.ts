import type { Ticker } from "pixi.js";
import type { World } from "../world";
import { randomMinMax } from "@/game/utils/common";
import getMaxHorseX from "../helpers/getMaxHorseX";

export default function horseMovementSystem(world: World, tick: Ticker) {
  if (world.gameState !== "started" && world.gameState !== "celebration") {
    return;
  }

  const dt = tick.deltaTime / 60;
  const dtMs = tick.elapsedMS;

  let fasterHorseX = 0;

  world.position.forEach((position, entityId) => {
    const velocity = world.velocity.get(entityId);
    if (!velocity) {
      return;
    }

    velocity.elapsed += tick.elapsedMS;

    if (velocity.elapsed >= 2000) {
      velocity.elapsed = 0;
      velocity.target = randomMinMax(
        world.gameConfig.speedMin,
        world.gameConfig.speedMax,
      );
    }

    /**
     * Smoothly interpolate currentSpeed toward targetSpeed over transitionDuration
     */
    const diff = velocity.target - velocity.current;
    const maxChange =
      (Math.abs(diff) / world.constants.horse.accelerationDuration) * dtMs;

    if (Math.abs(diff) <= maxChange) {
      velocity.current = velocity.target;
    } else {
      velocity.current += Math.sign(diff) * maxChange;
    }

    position.x += world.constants.horse.baseSpeed * velocity.current * dt;

    if (position.x >= getMaxHorseX(world)) {
      position.x = world.gameConfig.distance + world.constants.horse.startX;
    }

    /**
     * check and set fasterHorseX
     */
    if (position.x > fasterHorseX) {
      fasterHorseX = position.x;
      world.fasterHorse = entityId;
    }
  });
}
