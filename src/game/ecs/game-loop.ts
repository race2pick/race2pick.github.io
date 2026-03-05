import type { Ticker } from "pixi.js";
import cameraSystem from "./systems/camera-system";
import type { World } from "./world";
import horseMovementSystem from "./systems/horse-movement-system";
import horseAnimationSystem from "./systems/horse-animation-system";
import type { Render } from "../renders/types";
import renderSystem from "../renders/render-system";
import winnerSystem from "./systems/winner-system";

export default function gameLoop({
  world,
  render,
  tick,
}: {
  world: World;
  render: Render;
  tick: Ticker;
}) {
  horseMovementSystem(world, tick);
  winnerSystem(world);
  
  horseAnimationSystem(world, tick);
  cameraSystem(world, tick.deltaTime);

  renderSystem(world, render);
}
