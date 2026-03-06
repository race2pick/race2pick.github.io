import {
  AnimatedSprite,
  Application,
  Container,
  Texture,
} from "pixi.js";
import {
  GRASS_ALIASES,
  GRASS_FADED_ALIASES,
  PUDDLE_ALIASES,
} from "../static/assets";
import renderArena from "./arena/arena.render";
import type { World } from "../ecs/world";
import { getHorseIdleAssets, getHorseRunningAssets } from "@/lib/assets";
import renderHorses from "./horses/horses.render";
import type { Render } from "./types";

export interface RenderArenaState {
  container: Container;
  testures: {
    grasses: Texture[];
    grassFaded: Texture[];
    puddles: Texture[];
    startFinishLine: Texture;
  };
}

export interface RenderHorseState {
  container: Container;
  testures: {
    idle: Texture[];
    running: Texture[];
  };
}

export interface HorseView {
  container: Container;
  sprites: AnimatedSprite[];
  name: string;
}

export interface RenderState {
  app: Application;
  arena: RenderArenaState;
  horse: RenderHorseState;
  horses: Map<string, HorseView>;
}

export async function createRender({
  app,
  world,
}: {
  app: Application;
  world: World;
}): Promise<Render> {
  const cameraContainer = new Container({ label: "camera" });
  app.stage.addChild(cameraContainer);

  const arenaContainer = new Container({ label: "container", isRenderGroup: true });
  cameraContainer.addChild(arenaContainer);

  const grasses = GRASS_ALIASES.map((alias) => Texture.from(alias));
  const grassFaded = GRASS_FADED_ALIASES.map((alias) => Texture.from(alias));
  const puddles = PUDDLE_ALIASES.map((alias) => Texture.from(alias));
  const startFinishLine = Texture.from("start-finish");

  const horseContainer = new Container({ label: "horse" });

  cameraContainer.addChild(horseContainer);

  const horseIdle = await getHorseIdleAssets();
  const horseRun = await getHorseRunningAssets();

  const arena: Render["arena"] = {
    camera: cameraContainer,
    container: arenaContainer,
    testures: {
      grasses,
      grassFaded,
      puddles,
      startFinishLine,
    },
    cache: {
      grasses: null,
      grassFaded: null,
      puddles: null,
    },
  };

  const horseView: Render["horseView"] = {
    container: horseContainer,
    
    testures: {
      idle: horseIdle,
      running: horseRun,
    },
    horse: new Map(),
  };

  const render: Render = {
    app,
    arena,
    horseView,
  };

  renderArena(world, render);
  renderHorses(world, horseView);

  app.renderer.render(arenaContainer)

  return render;
}
