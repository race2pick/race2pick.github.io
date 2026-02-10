import { useArena } from "@/context/arena";
import { useApplication, useTick } from "@pixi/react";

import { HORSE_HEIGHT } from "../static/horse";
import HorseContainer from "./horse-container";
import { useRef } from "react";
import type { Container } from "pixi.js";

export default function Horse({
  size,
}: {
  size: { width: number; height: number };
}) {
  const { app } = useApplication();

  const { players, fasterCurrentPosition, gameState } = useArena();

  const containerRef = useRef<Container>(null);

  useTick(() => {
    if (gameState !== "started" || !containerRef.current) return;

    let maxX = 0;
    for (const child of containerRef.current.children) {
      if (child.x > maxX) {
        maxX = child.x;
      }
    }
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
