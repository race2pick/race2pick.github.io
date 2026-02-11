import { useMemo, useRef, useState } from "react";
import { useGameFlow, useTrackSettings } from "@/context/arena";
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
  const [isDone, setIsDone] = useState(false);
  const horseContainerRef = useRef<Container | null>(null);

  const { gameState } = useGameFlow();
  const { speed, distance } = useTrackSettings();

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

  useTick((tick) => {
    const dt = tick.deltaTime / 60;
    const dtMs = tick.elapsedMS;

    elapsed.current += dtMs;

    /**
     * when is idle do nothing for movement
     */
    if (gameState === "not-started") {
      return;
    }

    if (gameState === "end") {
      if (horseContainerRef.current) {
        setIsDone(false);
        horseContainerRef.current.x = HORSE_START_X;
        currentSpeed.current = 0;
        targetSpeed.current = randomMinMax(minSpeed, maxSpeed);
        currentSpeed.current = 0;
        elapsed.current = 0;
      }
      return;
    }

    /**
     * update speed every 2 seconds
     */
    if (elapsed.current >= 2000) {
      elapsed.current = 0;
      targetSpeed.current = randomMinMax(minSpeed, maxSpeed);
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
      if (horseContainerRef.current.x >= distance + HORSE_START_X) {
        setIsDone(true);
        return;
      }
      horseContainerRef.current.x += baseSpeed * currentSpeed.current * dt;
    }
  });

  return (
    <pixiContainer ref={horseContainerRef} x={HORSE_START_X} y={y} label={name}>
      <HorseAnimation
        index={index}
        name={name}
        currentSpeed={currentSpeed}
        horseColor={horseColor}
        isDone={isDone}
      />

      {/* Name label — positioned behind the horse, right edge at horse's back */}
      <Name name={name} horseColor={horseColor} />
    </pixiContainer>
  );
}
