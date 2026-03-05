import type { World } from "../world";

/** Lerp speed for camera smoothing (per frame at 60fps) */
const LERP_SPEED = 0.05;

export default function cameraSystem(world: World, dt: number) {
  if (!world.fasterHorse) {
    return;
  }
  const fasterHorse = world.position.get(world.fasterHorse);

  if (!fasterHorse) {
    return;
  }

  if (world.gameState === "not-started") {
    world.camera.pivotX = 0;
    return;
  }

  if (world.gameState !== "started") {
    return;
  }

  const screenWidth = world.screen.width;
  const horsePos = fasterHorse.x;
  const finishLineX = world.constants.horse.startX + world.gameConfig.distance;
  const horseX = horsePos + world.constants.horse.startX;

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
  const blend = Math.max(
    0,
    Math.min(1, 1 - remainingDistance / transitionZone),
  );

  /** Interpolate between horse-following and fixed finish position */
  const targetX = normalTarget + (finishTarget - normalTarget) * blend;

  /** Clamp camera: don't go negative, don't go past finish area */
  const maxX =
    world.gameConfig.distance -
    screenWidth +
    world.constants.horse.width +
    world.constants.horse.startX +
    16;
  const clampedTarget = Math.max(0, Math.min(targetX, maxX));

  /** If track fits entirely on screen, no camera movement needed */
  if (maxX <= 0) {
    world.camera.pivotX = 0;
    return;
  }

  /** Don't move camera until horse passes half the screen */
  if (horsePos <= screenWidth / 2) {
    return;
  }

  /** Frame-rate independent lerp */
  const lerp = 1 - Math.pow(1 - LERP_SPEED, dt);
  world.camera.pivotX += (clampedTarget - world.camera.pivotX) * lerp;

}
