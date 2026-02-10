import { useArena } from "@/context/arena";
import { useApplication, useTick } from "@pixi/react";

import { HORSE_HEIGHT } from "../static/horse";
import HorseContainer from "./horse-container";
import { useRef } from "react";
import type { Container, Graphics } from "pixi.js";

export default function Horse({
  size,
}: {
  size: { width: number; height: number };
}) {
  const { app } = useApplication();

  const { players } = useArena();

  const containerRef = useRef<Container>(null);
  const graphicsRef = useRef<Graphics>(null);

  useTick(() => {
    const bounds = containerRef.current?.getBounds();
    const g = graphicsRef.current;
    if (!bounds || !g) return;

    console.log('*****', 'bounds' , '->', bounds.width);
    g.clear();
    g.rect(0, 0, bounds.width, bounds.height).stroke({
      color: 0xff0000,
      width: 1,
    });
  });

  if (!app?.renderer) return null;

  const screenHeight = app.screen.height || size.height;

  return (
    <>
      <pixiGraphics ref={graphicsRef} draw={(graphics) => {}} />
      <pixiContainer ref={containerRef} x={0} y={0}>
        {players.map((player, index) => {
          const maxY = screenHeight - HORSE_HEIGHT;
          const gap = maxY / (players.length + 1);
          return (
            <HorseContainer
              y={(index + 1) * gap}
              index={index}
              name={player}
              key={player}
            />
          );
        })}
      </pixiContainer>
    </>
  );
}
