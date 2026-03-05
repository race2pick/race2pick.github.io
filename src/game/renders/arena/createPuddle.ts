import type { World } from "@/game/ecs/world";
import { getTrackLengthWithBuffer } from "./arena.render";
import { Container, RenderTexture, Sprite } from "pixi.js";
import { GREEN_LAND_HEIGHT } from "@/game/static/arena";
import type { Render } from "../types";
import type { Renderer } from "pixi.js";

export default function createPuddle(
  world: World,
  arena: Render["arena"],
  renderer: Renderer,
) {
  const trackLengthWithBuffer = getTrackLengthWithBuffer(world);

  // Build tile once, reuse on subsequent calls
  if (!arena.cache.puddles) {
    const tileWidth = world.screen.width * 2;
    const tileHeight = world.screen.height * 2;
    const playArea = tileHeight - GREEN_LAND_HEIGHT;

    // Density based on tile area
    const cellCount = Math.floor((tileWidth * tileHeight) / 20000);
    const puddlesPerCell = 3 + Math.floor(Math.random() * 3);
    const tilePuddles = cellCount * puddlesPerCell;

    const tileContainer = new Container();
    for (let i = 0; i < tilePuddles; i++) {
      const texture =
        arena.testures.puddles[
          Math.floor(Math.random() * arena.testures.puddles.length)
        ];
      const scale = 0.05 + Math.random() * 0.3;

      tileContainer.addChild(
        new Sprite({
          texture,
          x: Math.random() * tileWidth,
          y: Math.random() * playArea,
          scale: { x: scale, y: scale / 2 },
          anchor: 0.5,
          alpha: 0.5,
        }),
      );
    }

    const renderTexture = RenderTexture.create({
      width: tileWidth,
      height: playArea,
    });
    renderer.render({ container: tileContainer, target: renderTexture });
    tileContainer.destroy({ children: true });

    const container = new Container();
    arena.cache.puddles = { texture: renderTexture, container, tileWidth };
  }

  // Sync tiles to match current trackLengthWithBuffer
  const { texture, container, tileWidth } = arena.cache.puddles;
  const neededTiles = Math.ceil(trackLengthWithBuffer / tileWidth);
  const currentTiles = container.children.length;

  if (neededTiles > currentTiles) {
    for (let i = currentTiles; i < neededTiles; i++) {
      container.addChild(
        new Sprite({ texture, x: i * tileWidth, y: GREEN_LAND_HEIGHT }),
      );
    }
  } else if (neededTiles < currentTiles) {
    for (let i = currentTiles - 1; i >= neededTiles; i--) {
      container.removeChildAt(i).destroy();
    }
  }

  return container;
}
