import { useApplication, useTick } from "@pixi/react";
import { Container } from "pixi.js";

import { useRef } from "react";
import Background from "./components/background";
import Horse from "../horse";
import { useArena } from "@/context/arena";
import { HORSE_WIDTH } from "../static/horse";

const LERP_SPEED = 0.05;

export function Arena({ size }: { size: { width: number; height: number } }) {
  const arenaRef = useRef<Container>(null);
  const { app } = useApplication();
  const { distance, gameState, fasterCurrentPosition } = useArena();

  useTick(() => {
    app.queueResize();

    if (!arenaRef.current) return;

    if (gameState === "not-started") {
      arenaRef.current.pivot.x = 0;
      return;
    }

    if (gameState !== "started") return;

    const screenWidth = app.screen.width;
    const triggerPoint = screenWidth / 2;

    if (fasterCurrentPosition.current <= triggerPoint) return;

    let targetX = fasterCurrentPosition.current - triggerPoint;

    const maxX = distance - screenWidth + HORSE_WIDTH + 16;
    if (targetX > maxX) targetX = maxX;
    if (targetX < 0) targetX = 0;

    arenaRef.current.pivot.x +=
      (targetX - arenaRef.current.pivot.x) * LERP_SPEED;
  });

  if (!app?.renderer) return null;

  const screenHeight = app.screen.height || size.height;

  return (
    <pixiContainer ref={arenaRef} x={0} y={0}>
      <Background trackheight={screenHeight} />
      <Horse size={size} />
    </pixiContainer>
  );
}
