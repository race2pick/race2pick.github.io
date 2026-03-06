import type {
  AnimatedSprite,
  Application,
  Container,
  RenderTexture,
  Texture,
} from "pixi.js";
import type { EntityId } from "../ecs/entities/entity";

interface Arena {
  camera: Container;
  container: Container;
  testures: {
    grasses: Texture[];
    grassFaded: Texture[];
    puddles: Texture[];
    startFinishLine: Texture;
  };
  cache: {
    grasses: {
      texture: RenderTexture;
      container: Container;
      tileWidth: number;
    } | null;
    grassFaded: {
      texture: RenderTexture;
      container: Container;
      tileWidth: number;
    } | null;
    puddles: {
      texture: RenderTexture;
      container: Container;
      tileWidth: number;
    } | null;
  };
}

interface HorseView {
  container: Container;
  testures: {
    idle: Texture[];
    running: Texture[];
  };
  horse: Map<EntityId, Horse>;
}

interface Horse {
  name: string;
  container: Container;
  animationName: string;
  sprites: AnimatedSprite[];
}

export interface Render {
  app: Application;
  arena: Arena;
  horseView: HorseView;
}
