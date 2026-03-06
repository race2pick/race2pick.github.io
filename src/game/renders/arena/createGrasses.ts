import type { World } from "@/game/ecs/world";
import { getTrackLengthWithBuffer } from "./arena.render";
import { Container, RenderTexture, Sprite } from "pixi.js";
import { GRASS_GAP, GREEN_LAND_HEIGHT } from "@/game/static/arena";
import type { Render } from "../types";
import type { Renderer } from "pixi.js";

export default function createGrasses(
  world: World,
  arena: Render["arena"],
  renderer: Renderer,
) {
  const trackLengthWithBuffer = getTrackLengthWithBuffer(world);

  // Build tile strip once, reuse on subsequent calls
  if (!arena.cache.grasses) {
    const tileContainer = new Container();
    let x = GRASS_GAP;
    let tileWidth = 0;
    const tileTargetWidth = world.screen.width * 2;

    while (x < tileTargetWidth) {
      const texture =
        arena.testures.grasses[
          Math.floor(Math.random() * arena.testures.grasses.length)
        ];
      const scale = GREEN_LAND_HEIGHT / texture.height;
      const scaledWidth = texture.width * scale;

      tileContainer.addChild(
        new Sprite({
          texture,
          x,
          y: GREEN_LAND_HEIGHT,
          anchor: { x: 0, y: 1 },
          scale,
        }),
      );

      x += scaledWidth + GRASS_GAP;
      tileWidth = x;
    }

    const renderTexture = RenderTexture.create({
      width: tileWidth,
      height: GREEN_LAND_HEIGHT,
    });
    renderer.render({ container: tileContainer, target: renderTexture });
    tileContainer.destroy({ children: true });

    const container = new Container();
    arena.cache.grasses = { texture: renderTexture, container, tileWidth };
  }

  // Sync tiles to match current trackLengthWithBuffer
  const { texture, container, tileWidth } = arena.cache.grasses;
  const neededTiles = Math.ceil(trackLengthWithBuffer / tileWidth);
  const currentTiles = container.children.length;

  if (neededTiles > currentTiles) {
    for (let i = currentTiles; i < neededTiles; i++) {
      container.addChild(new Sprite({ texture, x: i * tileWidth, y: 0 }));
    }
  } else if (neededTiles < currentTiles) {
    for (let i = currentTiles - 1; i >= neededTiles; i--) {
      container.removeChildAt(i).destroy();
    }
  }

  return container;
}
