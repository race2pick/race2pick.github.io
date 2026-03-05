export type { World } from "./world";

// import { createHorseEntity } from "@/game/ecs/factories/horse";
// import type { GameConfig, GameConstant, Screen, World } from "./world.type";
// import {
//   HORSE_START_X,
//   baseSpeed,
//   accelerationDuration,
//   HORSE_HEIGHT,
// } from "@/game/static/horse";
// import type { CameraEntity } from "@/game/ecs/entities/camera";
// import type { TrackEntity } from "@/game/ecs/entities/track";

// export * from "./world.type";
// export { resetWorld } from "./resetWorld";

// export function createWorld({
//   players,
//   distance,
//   speedMin,
//   speedMax,
//   screen,
// }: {
//   players: string[];
//   distance: number;
//   speedMin: number;
//   speedMax: number;
//   screen: Screen;
// }): World {
//   const horseMaxY = screen.height - HORSE_HEIGHT;
//   const horseGap = horseMaxY / (players.length + 1);

//   const horses = players.map((name, i) =>
//     createHorseEntity({ name, index: i, y: (i + 1) * horseGap }),
//   );

//   const camera: CameraEntity = { camera: { pivotX: 0 } };
//   const track: TrackEntity = { track: { distance } };
//   const gameConfig: GameConfig = { distance, speedMin, speedMax };
//   // const screen: Screen = { width: 800, height: 400 };
//   const constants: GameConstant = {
//     baseSpeed,
//     accelerationDuration,
//     horseStartX: HORSE_START_X,
//   };

//   return {
//     horses,
//     camera,
//     track,
//     gameState: "not-started",
//     winner: null,
//     gameConfig,
//     screen,
//     constants,
//   };
// }
