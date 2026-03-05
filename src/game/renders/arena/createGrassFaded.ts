import type { World } from "@/game/ecs/world";
import { getTrackLengthWithBuffer } from "./arena.render";
import { Container, RenderTexture, Sprite } from "pixi.js";
import { GREEN_LAND_HEIGHT } from "@/game/static/arena";
import type { Render } from "../types";
import type { Renderer } from "pixi.js";

export default function createGrassFaded(
  world: World,
  arena: Render["arena"],
  renderer: Renderer,
) {
  const trackLengthWithBuffer = getTrackLengthWithBuffer(world);

  const TARGET_HEIGHT = 10;

  // Build tile strip once, reuse on subsequent calls
  if (!arena.cache.grassFaded) {
    const tileContainer = new Container();
    let x = 0;
    let tileWidth = 0;
    const tileTargetWidth = world.screen.width * 2;

    while (x < tileTargetWidth) {
      const texture =
        arena.testures.grassFaded[
          Math.floor(Math.random() * arena.testures.grassFaded.length)
        ];
      const scale = TARGET_HEIGHT / texture.height;
      const scaledWidth = texture.width * scale;

      tileContainer.addChild(
        new Sprite({
          texture,
          x,
          y: 0,
          anchor: { x: 0, y: 0 },
          scale,
        }),
      );

      x += scaledWidth;
      tileWidth = x;
    }

    const renderTexture = RenderTexture.create({
      width: tileWidth,
      height: TARGET_HEIGHT,
    });
    renderer.render({ container: tileContainer, target: renderTexture });
    tileContainer.destroy({ children: true });

    const container = new Container({ alpha: 0.3 });
    arena.cache.grassFaded = { texture: renderTexture, container, tileWidth };
  }

  // Sync tiles to match current trackLengthWithBuffer
  const { texture, container, tileWidth } = arena.cache.grassFaded;
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
