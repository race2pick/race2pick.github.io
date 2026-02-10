import { useApplication, useTick } from "@pixi/react";
import { Container } from "pixi.js";

import { useRef } from "react";
import Background from "./components/background";
import Horse from "../horse";
import { useArena } from "@/context/arena";
import { HORSE_START_X, HORSE_WIDTH } from "../static/horse";

/** Lerp speed for camera smoothing (per frame at 60fps) */
const LERP_SPEED = 0.05;

/**
 * Arena component — manages camera and renders the race track
 * @param size - Screen dimensions (width and height)
 */
export function Arena({ size }: { size: { width: number; height: number } }) {
  const arenaRef = useRef<Container>(null);
  const { app } = useApplication();
  const { distance, gameState, fasterCurrentPosition } = useArena();

  useTick((tick) => {
    if (!arenaRef.current) return;

    if (gameState === "not-started") {
      arenaRef.current.pivot.x = 0;
      return;
    }

    if (gameState !== "started") return;

    const screenWidth = app.screen.width;
    const horsePos = fasterCurrentPosition.current;
    const finishLineX = HORSE_START_X + distance;
    const horseX = horsePos + HORSE_START_X;

    /**
     * Two camera anchors:
     * - normalTarget: follows horse, horse stays at center of screen (1/2)
     * - finishTarget: fixed position, finish line at 3/4 of screen from left
     *   (does NOT follow horse — camera "waits" for horse to arrive)
     */
    const normalTarget = horsePos - screenWidth / 2;
    const finishTarget = finishLineX - screenWidth * 0.05;

    /**
     * Blend factor (0 to 1) based on how close the horse is to the finish.
     * When horse is far: blend = 0 → camera follows horse at center.
     * When horse is near finish: blend = 1 → camera moves to fixed finish position.
     *
     * The transition zone starts when the remaining distance equals one full screen width.
     */
    const remainingDistance = finishLineX - horseX;
    const transitionZone = screenWidth;
    const blend = Math.max(0, Math.min(1, 1 - remainingDistance / transitionZone));

    /** Interpolate between horse-following and fixed finish position */
    const targetX = normalTarget + (finishTarget - normalTarget) * blend;

    /** Clamp camera: don't go negative, don't go past finish area */
    const maxX = distance - screenWidth + HORSE_WIDTH + HORSE_START_X + 16;
    const clampedTarget = Math.max(0, Math.min(targetX, maxX));

    /** If track fits entirely on screen, no camera movement needed */
    if (maxX <= 0) {
      arenaRef.current.pivot.x = 0;
      return;
    }

    /** Don't move camera until horse passes half the screen */
    if (horsePos <= screenWidth / 2) return;

    /** Frame-rate independent lerp */
    const lerp = 1 - Math.pow(1 - LERP_SPEED, tick.deltaTime);
    arenaRef.current.pivot.x +=
      (clampedTarget - arenaRef.current.pivot.x) * lerp;
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
