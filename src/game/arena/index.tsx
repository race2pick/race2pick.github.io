import { useApplication, useTick } from "@pixi/react";
import { Container } from "pixi.js";

import { useRef } from "react";
import Background from "./components/background";
import Horse from "../horse";

export function Arena({ size }: { size: { width: number; height: number } }) {
  const arenaRef = useRef<Container>(null);
  const { app } = useApplication();

  useTick(() => {
    app.queueResize();
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
