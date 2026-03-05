import { useGameFlow, useTrackSettings } from "@/context/arena";
import type { World } from "../ecs/world";
import { useCallback, useEffect } from "react";
import { randomMinMax } from "../utils/common";

export default function useSyncStateToGame(world?: World | null) {
  const { gameState } = useGameFlow();
  const { speed } = useTrackSettings();

  function updateDefaultHorseSpeed(world: World) {
    for (const [, entityId] of world.horses) {
      const velocity = world.velocity.get(entityId);
      if (!velocity) {
        return;
      }
      velocity.target = randomMinMax(
        world.gameConfig.speedMin,
        world.gameConfig.speedMax,
      );
    }
  }

  const resetWorld = useCallback(() => {
    if (!world) {
      return;
    }

    world.setWinner(undefined);
    world.setGameState("not-started");
    world.camera.pivotX = 0;
    world.fasterHorse = undefined;
    for (const [, entityId] of world.horses) {
      const position = world.position.get(entityId);
      if (position) {
        position.x = world.constants.horse.startX;
      }

      world.velocity.set(entityId, {
        current: 0,
        target: randomMinMax(
          world.gameConfig.speedMin,
          world.gameConfig.speedMax,
        ),
        elapsed: 0,
      });

      world.animation.set(entityId, {
        name: "idle",
        speed: randomMinMax(
          world.constants.horse.animation.idle.minSpeed,
          world.constants.horse.animation.idle.maxSpeed,
        ),
        elapsed: 0,
      });
    }
  }, [world]);

  /**
   * sync game state to world
   */
  useEffect(() => {
    if (!world) {
      return;
    }

    if (gameState === "started") {
      world.gameState = "started";
    }

    if (gameState === "celebration") {
      world.gameState = "celebration";
    }
  }, [gameState, world]);

  /**
   * sync speed to world
   */
  useEffect(() => {
    if (!world) {
      return;
    }

    world.gameConfig.speedMin = speed[0];
    world.gameConfig.speedMax = speed[1];
    updateDefaultHorseSpeed(world);
  }, [speed, world]);

  useEffect(() => {
    if (!world) {
      return;
    }

    if (gameState === "end") {
      resetWorld();
    }
  }, [gameState, resetWorld, world]);
}
