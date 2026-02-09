import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useArena } from "@/context/arena";
// import { playerHeight } from "@/context/arena/constant";
import { useGameUI } from "@/context/game-ui";
import { extend, useApplication, useTick } from "@pixi/react";

import {
  Container,
  Graphics,
  Sprite,
  Texture,
  Assets,
  AnimatedSprite,
  Color,
  BlurFilter,
  Text,
} from "pixi.js";
import { randomMinMax } from "../utils/common";
import {
  accelerationDuration,
  baseSpeed,
  HORSE_COLORS,
  HORSE_HEIGHT,
  HORSE_START_X,
  HORSE_WIDTH,
  maxAnimSpeed,
  minAnimSpeed,
} from "../static/horse";
import HorseAnimation from "./components/horse-animation";
import Name from "./components/name";

extend({
  Container,
  Graphics,
  Sprite,
  AnimatedSprite,
  Text,
});

// const horseColor = [
//   "white",
//   "maroon",
//   "black",
//   "silver",
//   "gray",
//   "purple",
//   "fuchsia",
//   "green",
//   "red",
//   "lime",
//   "olive",
//   "yellow",
//   "navy",
//   "blue",
//   "teal",
//   "aqua",
// ];

// export const HORSE_START_X = 120;
// export const HORSE_WIDTH = 90;

// const useAsset = () => {
//   const [textures, setTextures] = useState<Texture[]>([]);
//   const [texturesIdle, setTexturesIdle] = useState<Texture[]>([]);
//   const isLoaded = useRef(false);

//   useEffect(() => {
//     const load = async () => {
//       const spritesheet = await Assets.load({
//         alias: "horse",
//         src: "./horse-sprites.json",
//       });
//       const frames = Object.values(spritesheet.textures) as Texture[];

//       setTextures(frames);

//       const spritesheetIdle = await Assets.load({
//         alias: "horse-idle",
//         src: "./horse-idle-sprites.json",
//       });

//       const framesIdle = Object.values(spritesheetIdle.textures) as Texture[];

//       setTexturesIdle(framesIdle);
//       isLoaded.current = true;
//     };

//     if (!isLoaded.current) {
//       load();
//     } else {
//       const spritesheet = Assets.get("horse");
//       const spritesheetIdle = Assets.get("horse-idle");
//       setTextures(Object.values(spritesheet.textures) as Texture[]);
//       setTexturesIdle(Object.values(spritesheetIdle.textures) as Texture[]);
//     }
//   }, []);

//   return { textures, texturesIdle };
// };

// function radomHorseSpeed(min: number, max: number) {
//   return Math.random() * (max - min) + min;
// }

export default function HorseIndex({
  y,
  index,
  name,
}: {
  y: number;
  index: number;
  name: string;
}) {
  // const { textures, texturesIdle } = useAsset();
  const shadowRef = useRef<AnimatedSprite | null>(null);
  const horseRef = useRef<AnimatedSprite | null>(null);
  const horseContainerRef = useRef<Container | null>(null);
  const bgRef = useRef<Graphics | null>(null);

  const { gameState, speed } = useArena();

  // const isIdle = useMemo(() => {
  //   return ["not-started", "end"].includes(gameState);
  // }, [gameState]);

  // const shadowBlur = useMemo(() => [new BlurFilter({ strength: 4 })], []);

  const minSpeed = speed[0];
  const maxSpeed = speed[1];

  // const baseSpeed = 5;
  const targetSpeed = useRef(randomMinMax(minSpeed, maxSpeed));
  const currentSpeed = useRef(0);
  const elapsed = useRef(0);
  // const minAnimSpeed = 0.15;
  // const maxAnimSpeed = 0.6;
  const animationSpeed = useRef(minAnimSpeed);
  // const transitionDuration = 1000; // 1 second for acceleration/deceleration

  // const themeId = useMemo(() => {
  //   const cycleIndex = index % horseColor.length;
  //   return horseColor[cycleIndex];
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const horseColor = useMemo(() => {
    const cycleIndex = index % HORSE_COLORS.length;
    return HORSE_COLORS[cycleIndex];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSpeed = useCallback(() => {
    targetSpeed.current = randomMinMax(minSpeed, maxSpeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useTick((tick) => {
    const dt = tick.deltaTime / 60;
    const dtMs = tick.elapsedMS;

    elapsed.current += dtMs;

    /**
     * when is idle do nothing for movement
     */
    if (gameState === "not-started" || gameState === "end") {
      return;
    }

    /**
     * update speed every 2 seconds
     */
    if (elapsed.current >= 2000) {
      elapsed.current = 0;
      updateSpeed();
    }

    /**
     * Smoothly interpolate currentSpeed toward targetSpeed over transitionDuration
     */
    const diff = targetSpeed.current - currentSpeed.current;
    const maxChange = (Math.abs(diff) / accelerationDuration) * dtMs;

    if (Math.abs(diff) <= maxChange) {
      currentSpeed.current = targetSpeed.current;
    } else {
      currentSpeed.current += Math.sign(diff) * maxChange;
    }

    if (horseContainerRef.current) {
      horseContainerRef.current.x += baseSpeed * currentSpeed.current * dt;
    }
  });

  return (
    <pixiContainer ref={horseContainerRef} x={HORSE_START_X} y={y}>
      {/* Shadow: noon sun — directly below, short, no skew */}
      <HorseAnimation
        index={index}
        currentSpeed={currentSpeed}
        horseColor={horseColor}
      />

      {/* Name label — positioned behind the horse, right edge at horse's back */}
      <Name name={name} horseColor={horseColor} />
    </pixiContainer>
  );
}
