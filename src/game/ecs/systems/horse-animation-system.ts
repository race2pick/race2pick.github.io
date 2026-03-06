import type { Ticker } from "pixi.js";
import type { World } from "../world";
import { randomMinMax } from "@/game/utils/common";
import getMaxHorseX from "../helpers/getMaxHorseX";

const minSpeed = 10;
const maxSpeed = 100;

function animateIdle(world: World, tick: Ticker, entityId: number) {
  const animation = world.animation.get(entityId);
  if (!animation) {
    return;
  }

  animation.elapsed += tick.elapsedMS;

  animation.name = "idle";

  if (animation.elapsed >= 3000) {
    animation.elapsed = 0;
    animation.speed = randomMinMax(
      world.constants.horse.animation.idle.minSpeed,
      world.constants.horse.animation.idle.maxSpeed,
    );
  }
}

export default function horseAnimationSystem(world: World, tick: Ticker) {
  const horseAnim = world.constants.horse.animation;

  if (world.gameState === "not-started") {
    world.horses.forEach((entityId) => {
      animateIdle(world, tick, entityId);
    });

    return;
  }

  if (world.gameState === "started") {
    world.horses.forEach((entityId) => {
      const animation = world.animation.get(entityId);
      const velocity = world.velocity.get(entityId);

      if (!animation || !velocity) return;

      animation.name = "running";

      /**
       * =====================================
       * Running animation speed
       * =====================================
       */

      const t = Math.min(
        Math.max((velocity.current - minSpeed) / (maxSpeed - minSpeed), 0),
        1,
      );

      const runningAnim = horseAnim.running;

      animation.speed =
        runningAnim.minSpeed +
        t * (runningAnim.maxSpeed - runningAnim.minSpeed);
    });
  }

  if (world.gameState === "finished") {
    world.horses.forEach((entityId) => {
      const animation = world.animation.get(entityId);
      if (!animation) return;
      animation.name = "running";
      animation.speed = 0;
    });
  }

  if (world.gameState === "celebration") {
    world.horses.forEach((entityId) => {
      const animation = world.animation.get(entityId);
      const velocity = world.velocity.get(entityId);
      const position = world.position.get(entityId);

      if (!animation || !velocity || !position) return;

      if (position.x < getMaxHorseX(world)) {
        animation.name = "running";
        const runningAnim = horseAnim.running;

        const t = Math.min(
          Math.max((velocity.current - minSpeed) / (maxSpeed - minSpeed), 0),
          1,
        );

        animation.speed =
          runningAnim.minSpeed +
          t * (runningAnim.maxSpeed - runningAnim.minSpeed);
      } else {
        animation.speed = randomMinMax(
          horseAnim.idle.minSpeed,
          horseAnim.idle.maxSpeed,
        );
        animateIdle(world, tick, entityId);
      }
    });
  }
}
