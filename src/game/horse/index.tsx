import { useArena } from "@/context/arena";
import { useApplication, useTick } from "@pixi/react";

import { HORSE_HEIGHT } from "../static/horse";
import HorseContainer from "./horse-container";
import { useEffect, useRef } from "react";
import type { Container } from "pixi.js";

export default function Horse({
  size,
}: {
  size: { width: number; height: number };
}) {
  const { app } = useApplication();

  const {
    players,
    fasterCurrentPosition,
    gameState,
    setGameState,
    distance,
    setWinner,
  } = useArena();

  const containerRef = useRef<Container>(null);

  useEffect(() => {
    app.queueResize();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);

  /**
   * tick to listent all horses position
   * then change the fasterCurrentPosition to move the camera
   */
  useTick(() => {
    if (gameState !== "started" || !containerRef.current) return;

    let maxX = 0;
    let hasWinner = false;

    for (const child of containerRef.current.children) {
      /**
       * wheck if the game has a winner
       */
      if (!hasWinner && gameState === "started" && child.x >= distance) {
        hasWinner = true;
        setGameState("finished");
        setWinner(child.label);
        child.x += 5;
        app.ticker.speed = 0;
      }

      /**
       * check child position x to move the camera
       */
      if (child.x > maxX) {
        maxX = child.x;
      }
    }

    // update fasterCurrentPosition to move the camera
    fasterCurrentPosition.current = maxX;
  });

  if (!app?.renderer) return null;

  const screenHeight = app.screen.height || size.height;

  return (
    <pixiContainer ref={containerRef} x={0} y={0}>
      {players.map((player, index) => {
        const maxY = screenHeight - HORSE_HEIGHT;
        const gap = maxY / (players.length + 1);
        return (
          <HorseContainer
            key={`horse-${player}`}
            y={(index + 1) * gap}
            index={index}
            name={player}
          />
        );
      })}
    </pixiContainer>
  );
}
