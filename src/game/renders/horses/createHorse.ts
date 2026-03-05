import type { HorseEntity } from "@/game/ecs/entities/horse";
import { AnimatedSprite, BlurFilter, Color, Container } from "pixi.js";
import type { RenderHorseState, RenderState } from "..";
import { HORSE_HEIGHT, HORSE_WIDTH } from "@/game/static/horse";
import createTextName from "./createTextName";

const shadowColor = new Color(0x000000);
const shadowBlur = new BlurFilter({ strength: 4 });

export default function createHorse(
  horse: HorseEntity,
  horseState: RenderHorseState,
  horseMap: RenderState["horses"],
) {
  const container = new Container({ label: `horse-${horse.tag.name}` });
  container.x = horse.position.x;
  container.y = horse.position.y;

  const sprite = new AnimatedSprite({
    textures: horseState.testures.idle,
    loop: true,
    anchor: 0,
    height: HORSE_HEIGHT,
    width: HORSE_WIDTH,
    autoPlay: true,
    tint: horse.tag.color,
    animationSpeed: horse.sprite.animSpeed,
  });

  const shadow = new AnimatedSprite({
    textures: horseState.testures.idle,
    loop: true,
    anchor: { x: 0.5, y: 0.4 },
    x: 0,
    y: HORSE_HEIGHT / 2,
    scale: { x: 0.3, y: -0.1 },
    tint: shadowColor,
    autoPlay: true,
    alpha: 0.3,
    filters: [shadowBlur],
    animationSpeed: horse.sprite.animSpeed,
  });

  shadow.currentFrame = sprite.currentFrame;

  const text = createTextName(horse.tag.name, horse.tag.color);

  container.addChild(sprite);
  container.addChild(shadow);
  container.addChild(text);
  horseMap.set(horse.tag.name, {
    container,
    sprites: [sprite, shadow],
    name: horse.tag.name,
  });
}
