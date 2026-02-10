import { useApplication, useTick } from "@pixi/react";
import { Container } from "pixi.js";

import { useRef } from "react";
import Background from "./components/background";
import Horse from "../horse";
import { useArena } from "@/context/arena";
import { HORSE_START_X, HORSE_WIDTH } from "../static/horse";

/** Linear interpolation speed for normal camera movement */
const LERP_SPEED = 0.05;

/** Camera speed multiplier when jumping to finish (2x the leading horse speed) */
const FINISH_CAM_SPEED_MULTIPLIER = 2;

/**
 * Arena component — manages camera and renders the race track
 * @param size - Screen dimensions (width and height)
 */
export function Arena({ size }: { size: { width: number; height: number } }) {
  /** Ref to the main arena container (used to shift pivot/camera) */
  const arenaRef = useRef<Container>(null);

  /** Previous position of the fastest horse (used to calculate delta/speed) */
  const prevHorsePos = useRef(0);

  /** Camera pivot.x position when the finish jump started */
  const finishCamStartX = useRef(0);

  /** Flag indicating whether the finish camera jump is active */
  const isFinishCam = useRef(false);

  const { app } = useApplication();
  const { distance, gameState, fasterCurrentPosition } = useArena();

  useTick(() => {
    app.queueResize();

    if (!arenaRef.current) return;

    /** Reset camera to initial position when game has not started */
    if (gameState === "not-started") {
      arenaRef.current.pivot.x = 0;
      return;
    }

    /** Only process camera while game is running */
    if (gameState !== "started") return;

    /** Current screen width */
    const screenWidth = app.screen.width;

    /** Trigger point: camera starts moving when the fastest horse passes half the screen */
    const triggerPoint = screenWidth / 2;

    /** If the fastest horse hasn't passed the trigger point, keep camera still */
    if (fasterCurrentPosition.current <= triggerPoint) return;

    /** Target camera position: keep the fastest horse at the center of the screen */
    let targetX = fasterCurrentPosition.current - triggerPoint;

    /** Maximum camera scroll so it doesn't go past the finish line */
    const maxX = distance - screenWidth + HORSE_WIDTH + HORSE_START_X + 16;
    if (targetX > maxX) targetX = maxX;
    if (targetX < 0) targetX = 0;

    /** Finish line position in world space */
    const finishLineX = HORSE_START_X + distance;

    /** Left edge of the viewport when camera is at maxX */
    const cameraLeft = maxX;

    /** Right edge of the viewport when camera is at maxX */
    const cameraRight = maxX + screenWidth;

    /** Fastest horse position in world space */
    const horseX = fasterCurrentPosition.current + HORSE_START_X;

    /**
     * If both the fastest horse and finish line are visible on screen when camera is at maxX,
     * move camera to maxX at 2x the leading horse speed with ease-in-out
     */
    if (horseX >= cameraLeft / 1.3 && finishLineX <= cameraRight) {
      /** Initialize jump: record starting camera position */
      if (!isFinishCam.current) {
        isFinishCam.current = true;
        finishCamStartX.current = arenaRef.current.pivot.x;
      }

      /** Calculate horse position delta (horse speed per frame) */
      const horseDelta = fasterCurrentPosition.current - prevHorsePos.current;

      /** Camera progress from start position to maxX (0 to 1) */
      const totalDistance = maxX - finishCamStartX.current;
      const progress =
        totalDistance > 0
          ? (arenaRef.current.pivot.x - finishCamStartX.current) /
            totalDistance
          : 1;

      /**
       * Ease-in-out:
       * - Start (progress 0): factor = 1 (same as horse speed)
       * - Middle (progress 0.5): factor = FINISH_CAM_SPEED_MULTIPLIER (2x horse)
       * - End (progress 1): factor approaches minimum (slows down)
       */
      const peak = FINISH_CAM_SPEED_MULTIPLIER;
      const easeFactor = Math.max(
        progress < 0.5
          ? 1 + (peak - 1) * (progress / 0.5)   // ease-in: 1 → peak
          : peak * 2 * (1 - progress),            // ease-out: peak → 0
        0.5,
      );

      /** Move camera at horse speed * easeFactor */
      const camSpeed = Math.abs(horseDelta) * easeFactor;
      arenaRef.current.pivot.x = Math.min(
        arenaRef.current.pivot.x + camSpeed,
        maxX,
      );

      prevHorsePos.current = fasterCurrentPosition.current;
      return;
    }

    /** Reset finish camera jump state if condition is no longer met */
    isFinishCam.current = false;

    /** Update previous horse position */
    prevHorsePos.current = fasterCurrentPosition.current;

    /** Normal camera movement: lerp following the fastest horse */
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
