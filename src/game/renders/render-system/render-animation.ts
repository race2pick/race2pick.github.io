import type { World } from "@/game/ecs/world";
import type { Render } from "@/game/renders/types";

export default function renderAnimations(world: World, render: Render) {
  world.animation.forEach((animation, entityId) => {
    const horseView = render.horseView.horse.get(entityId);
    if (!horseView) {
      return;
    }

    horseView.sprites.forEach((sprite) => {
      sprite.animationSpeed = animation.speed;

      if (world.gameState === "finished") {
        if (world.winner === entityId) {
          sprite.currentFrame = 8;
        }

        if (
          world.winner &&
          world.winner !== entityId &&
          sprite.currentFrame >= 6
        ) {
          sprite.currentFrame = 5;
        }
      }
    });

    if (horseView.animationName !== animation.name) {
      horseView.animationName = animation.name;

      horseView.sprites.forEach((sprite) => {
        sprite.textures =
          animation.name === "running"
            ? render.horseView.testures.running
            : render.horseView.testures.idle;

        sprite.play();
      });
    }
  });
}
