import type { EntityId } from "../entities/entity";
import type {
  Animation,
  Camera,
  Meta,
  Position,
  Velocity,
} from "../components";

export type GameState =
  | "not-started"
  | "started"
  | "finished"
  | "celebration"
  | "end";

export interface GameConfig {
  distance: number;
  speedMin: number;
  speedMax: number;
}

export interface GameConstant {
  horse: {
    baseSpeed: number;
    accelerationDuration: number;
    startX: number;
    width: number;
    height: number;
    animation: {
      idle:{
        minSpeed: number;
        maxSpeed: number;
      },
      running: {
        minSpeed: number;
        maxSpeed: number;
      }
    }
  };
}

export interface Screen {
  width: number;
  height: number;
}

export interface World {
  // Entities
  position: Map<EntityId, Position>;
  velocity: Map<EntityId, Velocity>;
  meta: Map<EntityId, Meta>;
  animation: Map<EntityId, Animation>;
  camera: Camera;
  horses: Map<string, EntityId>;

  // Game config
  gameConfig: GameConfig;

  // Global game state
  gameState: GameState;
  setGameState: (gameState: GameState) => void;
  winner?: EntityId;
  setWinner: (winner?: EntityId) => void;
  fasterHorse?: EntityId;

  // Screen info (diupdate oleh React saat resize)
  screen: Screen;

  cb: {
    onGameStateChange: (gameState: GameState) => void;
    onWinnerChange: (winner?: string) => void;
  };

  // Constants (readonly)
  readonly constants: GameConstant;
}
