import { useApplication, useTick } from "@pixi/react";
import { Container } from "pixi.js";

import { useRef } from "react";
import { useArena } from "@/context/arena";
import { playerHeight } from "@/context/arena/constant";
import Background from "./components/background";
import Horse from "../horse";

export function Arena({ size }: { size: { width: number; height: number } }) {
  const arenaRef = useRef<Container>(null);
  const { app } = useApplication();
  const { players } = useArena();

  useTick(() => {
    app.queueResize();
  });

  if (!app?.renderer) return null;

  const screenHeight = app.screen.height || size.height;

  return (
    <pixiContainer ref={arenaRef} x={0} y={0}>
      <Background trackheight={screenHeight} />
      {players.map((player, index) => {
        const maxY = screenHeight - playerHeight;
        const gap = maxY / (players.length + 1);
        return (
          <Horse
            y={(index + 1) * gap}
            index={index}
            name={player}
            key={player}
          />
        );
      })}
    </pixiContainer>
  );
}
