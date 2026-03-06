import type { World } from "@/game/ecs/world";
import type { Render } from "../types";
import { AnimatedSprite, Color, Container } from "pixi.js";
import createTextName from "./createTextName";

const shadowColor = new Color(0x000000);

export default function renderHorses(
  world: World,
  horseView: Render["horseView"],
) {
  horseView.horse.forEach((horse, entityId) => {
    if (!world.horses.has(horse.name)) {
      horse.container.destroy({ children: true });
      horseView.horse.delete(entityId);
    }
  });

  world.horses.forEach((entityId, name) => {
    const position = world.position.get(entityId) ?? { x: 0, y: 0 };

    const existing = horseView.horse.get(entityId);

    if (existing) {
      existing.container.x = position.x;
      existing.container.y = position.y;
      return;
    }

    const meta = world.meta.get(entityId) ?? { name: "", color: "" };
    const animation = world.animation.get(entityId) ?? {
      name: "idle",
      speed: 0,
    };

    const container = new Container({ label: name });
    container.x = position.x;
    container.y = position.y;

    const sprite = new AnimatedSprite({
      textures:
        animation.name === "running"
          ? horseView.testures.running
          : horseView.testures.idle,
      loop: true,
      anchor: 0,
      height: world.constants.horse.height,
      width: world.constants.horse.width,
      autoPlay: true,
      tint: meta.color,
      animationSpeed: animation.speed,
    });

    const shadow = new AnimatedSprite({
      textures:
        animation.name === "running"
          ? horseView.testures.running
          : horseView.testures.idle,
      loop: true,
      anchor: { x: 0.5, y: 0.4 },
      x: 0,
      y: world.constants.horse.height / 2,
      scale: { x: 0.3, y: -0.1 },
      tint: shadowColor,
      autoPlay: true,
      alpha: 0.1,
      filters: [],
      animationSpeed: animation.speed,
    });

    shadow.currentFrame = sprite.currentFrame;

    container.addChild(sprite);
    container.addChild(shadow);

    const label = createTextName(meta.name, meta.color);

    container.addChild(label);

    horseView.container.addChild(container);

    horseView.horse.set(entityId, {
      name,
      container: container,
      animationName: animation.name,
      sprites: [sprite, shadow],
    });
  });
}
