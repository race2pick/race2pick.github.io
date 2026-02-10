import { useCallback, useMemo, useRef } from "react";
import { useArena } from "@/context/arena";
import { useTick } from "@pixi/react";

import { Container } from "pixi.js";
import { randomMinMax } from "../utils/common";
import {
  accelerationDuration,
  baseSpeed,
  HORSE_COLORS,
  HORSE_START_X,
} from "../static/horse";
import HorseAnimation from "./components/horse-animation";
import Name from "./components/name";

export default function HorseContainer({
  y,
  index,
  name,
}: {
  y: number;
  index: number;
  name: string;
}) {
  const horseContainerRef = useRef<Container | null>(null);

  const { gameState, speed } = useArena();

  const minSpeed = speed[0];
  const maxSpeed = speed[1];

  const targetSpeed = useRef(randomMinMax(minSpeed, maxSpeed));
  const currentSpeed = useRef(0);
  const elapsed = useRef(0);

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
