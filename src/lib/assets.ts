import {
  GRASS_ALIASES,
  GRASS_FADED_ALIASES,
  PUDDLE_ALIASES,
} from "@/game/static/assets";
import { HORSE_ASSETS } from "@/game/static/horse";
import { Assets, Texture } from "pixi.js";

let assetsPromise: Promise<void>[] | null = null;

async function loadLandAssets() {
  Assets.addBundle("grass", [
    { alias: GRASS_ALIASES[0], src: "./grass1.svg" },
    { alias: GRASS_ALIASES[1], src: "./grass2.svg" },
    { alias: GRASS_ALIASES[2], src: "./grass3.svg" },
  ]);

  Assets.addBundle("grass-faded", [
    { alias: GRASS_FADED_ALIASES[0], src: "./grass-faded-01.svg" },
    { alias: GRASS_FADED_ALIASES[1], src: "./grass-faded-02.svg" },
    { alias: GRASS_FADED_ALIASES[2], src: "./grass-faded-03.svg" },
  ]);

  Assets.addBundle("puddle", [
    { alias: PUDDLE_ALIASES[0], src: "./puddle01.svg" },
    { alias: PUDDLE_ALIASES[1], src: "./puddle02.svg" },
    { alias: PUDDLE_ALIASES[2], src: "./puddle03.svg" },
    { alias: PUDDLE_ALIASES[3], src: "./puddle04.svg" },
  ]);

  await Assets.loadBundle("grass");
  await Assets.loadBundle("grass-faded");
  await Assets.loadBundle("puddle");
  await Assets.load({
    alias: "start-finish",
    src: "./line.svg",
  });
}

export async function loadHorseRunningAssets() {
  return Assets.load({
    alias: HORSE_ASSETS.horse,
    src: "./horse-sprites.json",
  });
}

export async function loadHorseIdleAssets() {
  return Assets.load({
    alias: HORSE_ASSETS["horse-idle"],
    src: "./horse-idle-sprites.json",
  });
}

async function loadHorseAssets() {
  await loadHorseRunningAssets();

  await loadHorseIdleAssets();
}

export function loadAssets() {
  if (!assetsPromise) {
    assetsPromise = [loadLandAssets(), loadHorseAssets()];
  }
  return Promise.all(assetsPromise);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTexture(spritesheet: any) {
  if (!spritesheet?.textures) return [];
  return Object.values(spritesheet.textures) as Texture[];
}

export async function getHorseRunningAssets() {
  const horseRun = await Assets.get(HORSE_ASSETS.horse);
  if (!horseRun) {
    await loadHorseRunningAssets();
    return getTexture(Assets.get(HORSE_ASSETS.horse));
  }

  return getTexture(horseRun);
}

export async function getHorseIdleAssets() {
  const horseIdle = await Assets.get(HORSE_ASSETS["horse-idle"]);
  if (!horseIdle) {
    await loadHorseRunningAssets();
    return getTexture(Assets.get(HORSE_ASSETS["horse-idle"]));
  }

  return getTexture(horseIdle);
}
