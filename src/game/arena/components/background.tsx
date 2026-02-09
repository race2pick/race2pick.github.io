import { useTrackLength } from "@/game/hooks/useTrackLength";
import { GRASS_GAP, GREEN_LAND_HEIGHT } from "@/game/static/arena";
import {
  GRASS_ALIASES,
  GRASS_FADED_ALIASES,
  PUDDLE_ALIASES,
} from "@/game/static/assets";
import { HORSE_START_X, HORSE_WIDTH } from "@/game/static/horse";
import { extend } from "@pixi/react";
import {
  Color,
  Container,
  Graphics,
  Sprite,
  Texture,
  TilingSprite,
  FillGradient,
  Assets,
  BlurFilter,
  NoiseFilter,
} from "pixi.js";
import { useEffect, useMemo, useRef, useState } from "react";

extend({
  Container,
  Graphics,
  Sprite,
  TilingSprite,
});

const useGrassAssets = () => {
  const [loaded, setLoaded] = useState(false);
  const isLoaded = useRef(false);

  useEffect(() => {
    const load = async () => {
      Assets.addBundle("grass", [
        { alias: "grass1", src: "./grass1.svg" },
        { alias: "grass2", src: "./grass2.svg" },
        { alias: "grass3", src: "./grass3.svg" },
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

      isLoaded.current = true;

      setLoaded(true);
    };

    if (!isLoaded.current) {
      load();
    } else {
      setLoaded(true);
    }
  }, []);

  return loaded;
};

function Land({ trackheight }: { trackheight: number }) {
  const { trackLengthWithBuffer } = useTrackLength();

  return (
    <>
      {/* desert land */}
      <pixiGraphics
        x={0}
        y={0}
        draw={(graphics) => {
          graphics.clear();
          graphics.rect(0, 0, trackLengthWithBuffer, trackheight).fill(
            new FillGradient({
              type: "linear",
              start: { x: 0, y: 0 },
              end: { x: 0, y: trackheight },
              colorStops: [
                {
                  offset: 0,
                  color: "#8b5a2b",
                },
                {
                  offset: 0.7,
                  color: "#704321",
                },
                {
                  offset: 1,
                  color: "#5c3220",
                },
              ],
            }),
          );
        }}
      />

      {/* green land */}
      <pixiGraphics
        x={0}
        y={0}
        draw={(graphics) => {
          graphics.clear();
          graphics.rect(0, 0, trackLengthWithBuffer, GREEN_LAND_HEIGHT).fill(
            new FillGradient({
              type: "linear",
              start: { x: 0, y: 0 },
              end: { x: 0, y: GREEN_LAND_HEIGHT },
              colorStops: [
                {
                  offset: 0,
                  color: "#47c45a",
                },
                {
                  offset: 0.7,
                  color: "#379a47",
                },
                {
                  offset: 1,
                  color: "#379a47",
                },
              ],
            }),
          );
        }}
      />
    </>
  );
}

function Grass() {
  const loaded = useGrassAssets();

  const { trackLengthWithBuffer } = useTrackLength();

  const grassItems = useMemo(() => {
    if (!loaded) return [];

    const items: { alias: string; x: number; scale: number }[] = [];
    let x = GRASS_GAP;
    const containerWidth = trackLengthWithBuffer;

    while (x < containerWidth) {
      const alias =
        GRASS_ALIASES[Math.floor(Math.random() * GRASS_ALIASES.length)];
      const texture = Texture.from(alias);
      const scale = GREEN_LAND_HEIGHT / texture.height;
      const scaledWidth = texture.width * scale;
      items.push({
        alias,
        x,
        scale,
      });
      x += scaledWidth + GRASS_GAP;
    }

    return items;
  }, [loaded, trackLengthWithBuffer]);

  if (!loaded) return null;

  return (
    <>
      {grassItems.map((item, index) => (
        <pixiSprite
          key={index}
          texture={Texture.from(item.alias)}
          x={item.x}
          y={GREEN_LAND_HEIGHT}
          scale={item.scale}
          anchor={{ x: 0, y: 1 }}
        />
      ))}
    </>
  );
}

function GrassFaded() {
  const loaded = useGrassAssets();

  const { trackLengthWithBuffer } = useTrackLength();

  const grassItems = useMemo(() => {
    if (!loaded) return [];

    const TARGET_HEIGHT = 10;

    const items: { alias: string; x: number; scale: number }[] = [];

    let x = 0;
    const containerWidth = trackLengthWithBuffer;

    while (x < containerWidth) {
      const alias =
        GRASS_FADED_ALIASES[
          Math.floor(Math.random() * GRASS_FADED_ALIASES.length)
        ];
      const texture = Texture.from(alias);
      const scale = TARGET_HEIGHT / texture.height;
      const scaledWidth = texture.width * scale;
      items.push({
        alias,
        x,
        scale,
      });
      x += scaledWidth;
    }

    return items;
  }, [loaded, trackLengthWithBuffer]);

  if (!loaded) return null;

  return (
    <>
      {grassItems.map((item, index) => (
        <pixiSprite
          key={index}
          texture={Texture.from(item.alias)}
          x={item.x}
          y={24}
          scale={item.scale}
          anchor={{ x: 0, y: 0 }}
          alpha={0.3}
        />
      ))}
    </>
  );
}

function Puddle({ trackheight }: { trackheight: number }) {
  const loaded = useGrassAssets();

  const { trackLengthWithBuffer } = useTrackLength();

  const puddleItems = useMemo(() => {
    if (!loaded) return [];

    const area = trackLengthWithBuffer * trackheight;
    const cellCount = Math.floor(area / 30000);
    const puddlesPerCell = 3 + Math.floor(Math.random() * 3); // 3, 4, or 5
    const totalPuddles = cellCount * puddlesPerCell;

    const items: {
      alias: string;
      x: number;
      y: number;
      scale: number;
    }[] = [];

    for (let i = 0; i < totalPuddles; i++) {
      const alias =
        PUDDLE_ALIASES[Math.floor(Math.random() * PUDDLE_ALIASES.length)];
      const scale = 0.05 + Math.random() * 0.3; // 0.05 to 0.35

      const x = Math.random() * trackLengthWithBuffer;
      const y =
        GREEN_LAND_HEIGHT + Math.random() * (trackheight - GREEN_LAND_HEIGHT);

      items.push({ alias, x, y, scale });
    }

    return items;
  }, [loaded, trackLengthWithBuffer, trackheight]);

  if (!loaded) return null;

  return (
    <>
      {puddleItems.map((item, index) => (
        <pixiSprite
          key={index}
          texture={Texture.from(item.alias)}
          x={item.x}
          y={item.y}
          scale={{ x: item.scale, y: item.scale / 2 }}
          anchor={0.5}
          alpha={0.5}
        />
      ))}
    </>
  );
}

function StartFinishLine({
  x,
  trackHeight,
}: {
  x: number;
  trackHeight: number;
}) {
  const loaded = useGrassAssets();

  const shadowBlurNoise = useMemo(
    () => [new BlurFilter({ strength: 1 }), new NoiseFilter({ noise: 0.2 })],
    [],
  );

  if (!loaded) return null;

  const texture = Texture.from("start-finish");

  return (
    <pixiTilingSprite
      texture={texture}
      x={x}
      y={GREEN_LAND_HEIGHT}
      width={texture.width / 4}
      height={trackHeight}
      tileScale={{ x: 1 / 4, y: 1 / 4 }}
      alpha={0.6}
      tint={new Color("#aa8b7e2c")}
      filters={shadowBlurNoise}
    />
  );
}

export default function Background({
  trackLength,
  trackheight,
}: {
  trackLength: number;
  trackheight: number;
}) {
  return (
    <pixiContainer x={0} y={0} height={trackheight}>
      <Land trackheight={trackheight} />
      <StartFinishLine
        x={HORSE_START_X + HORSE_WIDTH - 8}
        trackHeight={trackheight}
      />

      <Grass />
      <GrassFaded />
      <Puddle trackheight={trackheight} />
    </pixiContainer>
  );
}
