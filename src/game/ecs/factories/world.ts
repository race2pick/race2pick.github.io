import type { Animation, Meta, Position, Velocity } from "../components";
import type { EntityId } from "../entities/entity";
import type { World } from "../world";

import {
  HORSE_START_X,
  baseSpeed,
  accelerationDuration,
  HORSE_HEIGHT,
  HORSE_WIDTH,
  minAnimSpeed,
  maxAnimSpeed,
} from "@/game/static/horse";

import { createHorse } from "./horse";

export default function createWorld({
  players,
  distance,
  speedMin,
  speedMax,
  screen,
  onGameStateChange,
  onWinnerChange,
}: {
  players: string[];
  distance: number;
  speedMin: number;
  speedMax: number;
  screen: World["screen"];
  onGameStateChange: World["cb"]["onGameStateChange"];
  onWinnerChange: World["cb"]["onWinnerChange"];
}): World {
  const constants: World["constants"] = {
    horse: {
      baseSpeed,
      startX: HORSE_START_X,
      accelerationDuration: accelerationDuration,
      height: HORSE_HEIGHT,
      width: HORSE_WIDTH,
      animation: {
        idle: {
          minSpeed: 0.05,
          maxSpeed: 0.15,
        },
        running: {
          minSpeed: minAnimSpeed,
          maxSpeed: maxAnimSpeed,
        },
      },
    },
  };

  const position = new Map<EntityId, Position>(),
    velocity = new Map<EntityId, Velocity>(),
    animation = new Map<EntityId, Animation>(),
    meta = new Map<EntityId, Meta>(),
    horses = new Map<string, EntityId>();

  const setGameState = (gameState: World["gameState"]) => {
    world.gameState = gameState;
    world.cb.onGameStateChange(gameState);
  };

  const setWinner = (winner?: EntityId) => {
    if (!winner) {
      world.winner = undefined;
      world.cb.onWinnerChange(undefined);
      return;
    }
    
    const meta = world.meta.get(winner);
    if (!meta) {
      return;
    }

    world.winner = winner;
    world.cb.onWinnerChange(meta.name);
  };

  const world: World = {
    position,
    velocity,
    animation,
    camera: {
      pivotX: 0,
    },
    meta,
    horses,
    gameState: "not-started",
    setGameState,
    gameConfig: {
      distance,
      speedMax,
      speedMin,
    },
    screen,
    winner: undefined,
    setWinner,
    cb: {
      onGameStateChange,
      onWinnerChange,
    },
    constants,
  };

  players.forEach((name, index) => {
    createHorse(world, { name, index, playerLength: players.length });
  });

  return world;
}
