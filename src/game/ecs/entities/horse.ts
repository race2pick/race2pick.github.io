import type { HorseSpriteData, HorseTag, Position, Velocity } from "@/game/ecs/components";

export interface HorseEntity {
  position: Position;
  velocity: Velocity;
  tag: HorseTag;
  sprite: HorseSpriteData;
}
