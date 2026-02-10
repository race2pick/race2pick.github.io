import { BlurFilter, Color, type AnimatedSprite } from "pixi.js";
import { useHorseAssets } from "../useHorseAssets";
import { useMemo, useRef, type RefObject } from "react";
import { useArena } from "@/context/arena";
import {
  HORSE_HEIGHT,
  HORSE_WIDTH,
  maxAnimSpeed,
  minAnimSpeed,
} from "@/game/static/horse";
import { useTick } from "@pixi/react";
import { randomMinMax } from "@/game/utils/common";

export default function HorseAnimation({
  currentSpeed,
  horseColor,
}: {
  index: number;
  currentSpeed: RefObject<number>;
  horseColor: string;
}) {
  const { textures, texturesIdle } = useHorseAssets();

  const { gameState, speed } = useArena();

  const elapsed = useRef(0);
  const shadowRef = useRef<AnimatedSprite | null>(null);
  const horseRef = useRef<AnimatedSprite | null>(null);
  const animationSpeed = useRef(0.05);

  const minSpeed = speed[0];
  const maxSpeed = speed[1];

  const isIdle = useMemo(() => {
    return ["not-started", "end"].includes(gameState);
  }, [gameState]);

  const shadowBlur = useMemo(() => [new BlurFilter({ strength: 4 })], []);

  useTick((tick) => {
    const dtMs = tick.elapsedMS;

    elapsed.current += dtMs;

    /**
     * ====================
     * idle animation speed
     * ====================
     */
    if (gameState === "not-started" || gameState === "end") {
      if (!horseRef.current || !shadowRef.current) return;

      if (elapsed.current >= 1000) {
        elapsed.current = 0;
        const idleSpeed = randomMinMax(0.05, 0.15);
        horseRef.current.animationSpeed = idleSpeed;
        shadowRef.current.animationSpeed = idleSpeed;
      }

      return;
    }

    /**
     * =====================================
     * When not Idle running animation speed
     * =====================================
     */

    const t = Math.min(
      Math.max((currentSpeed.current - minSpeed) / (maxSpeed - minSpeed), 0),
      1,
    );

    animationSpeed.current = minAnimSpeed + t * (maxAnimSpeed - minAnimSpeed);

    if (horseRef.current)
      horseRef.current.animationSpeed = animationSpeed.current;
    if (shadowRef.current)
      shadowRef.current.animationSpeed = animationSpeed.current;
  });

  return (
    <>
      {/* Shadow: noon sun — directly below, short, no skew */}
      {texturesIdle.length > 0 && (
        <pixiAnimatedSprite
          ref={(ref: AnimatedSprite | null) => {
            if (ref) {
              shadowRef.current = ref;
              ref.play();

              if (horseRef.current) {
                ref.currentFrame = horseRef.current.currentFrame;
              }
            }
          }}
          textures={isIdle ? texturesIdle : textures}
          animationSpeed={animationSpeed.current}
          loop={true}
          anchor={{ x: 0.5, y: 0.4 }}
          x={45}
          y={HORSE_HEIGHT + 2}
          scale={{ x: 0.3, y: -0.1 }}
          tint={new Color(0x000000)}
          alpha={0.3}
          filters={shadowBlur}
        />
      )}
      {/* Horse */}
      {texturesIdle.length > 0 && (
        <pixiAnimatedSprite
          ref={(ref: AnimatedSprite | null) => {
            if (ref) {
              ref.currentFrame = Math.floor(randomMinMax(0, ref.totalFrames));
              horseRef.current = ref;
              ref.play();

              // sync shadow with horse
              if (shadowRef.current) {
                shadowRef.current.currentFrame = ref.currentFrame;
              }
            }
          }}
          textures={isIdle ? texturesIdle : textures}
          animationSpeed={animationSpeed.current}
          loop={true}
          anchor={0}
          height={HORSE_HEIGHT}
          width={HORSE_WIDTH}
          tint={new Color(horseColor)}
        />
      )}
    </>
  );
}
