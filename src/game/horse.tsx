/* eslint-disable react-hooks/exhaustive-deps */
import { useArena, playerBoxWidth } from "@/context/arena";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useMotionValueEvent } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useLottie } from "lottie-react";
import horseAmin from "../assets/horse.json";

const themes = [
  "white",
  "red",
  "black",
  "green",
  "blue",
  "orchid",
  "yellow",
  "magenta",
  "cyan",
  "oranye",
  "chartreuse",
  "deep-pink",
  "dark-turquoise",
  "green-yellow",
  "orangered",
  "turquoise",
  "gold",
  "lawn-green",
  "hot-pink",
  "cornflower-blue",
  "dodger-blue",
];

interface HorseProps {
  name: string;
  index: number;
}

export default function Horse({ name, index }: HorseProps) {
  const [position, setPosition] = useState(0);
  const [curPosition, setCurPosition] = useState(0);

  const {
    players,
    gameState,
    playerHeight,
    playerGap,
    distance,
    winner,
    speed,
    setWinner,
    setGameState,
    setCurrentFaster,
  } = useArena();

  const playerCount = players?.length || 1;

  const raceLong = useMemo(() => {
    return distance - playerBoxWidth + 5; // 5 is save margin
  }, [distance]);

  const x = useMotionValue(0);

  const themeId = useMemo(() => {
    const cycleIndex = index % themes.length;
    return themes[cycleIndex];
  }, []);

  const {
    View,
    play: dotlottiePlay,
    pause: dotlottiePause,
    setSpeed: dotlottieSetSpeed,
    goToAndStop: dotlottieGoToAndStop,
  } = useLottie({
    animationData: horseAmin,
    loop: true,
    autoplay: false,
    renderer: "svg",
    style: { height: `${playerHeight}px`, width: "70px", flexShrink: 0 },
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet",
    },
  });

  useEffect(() => {
    if (gameState === "not-started") {
      dotlottieGoToAndStop(0);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === "started") {
      dotlottiePlay();
      const min = speed[0] * 7;
      const max = speed[1] * 7;
      const boost = randomInt(min, max);
      const ratio = (boost - min) / (max - min);
      const animSpeed = 0.5 + ratio * 0.1 * 1.0;
      dotlottieSetSpeed(Math.max(animSpeed, 0.5));
      setPosition(boost);
    }
  }, [gameState, speed]);

  useEffect(() => {
    if (gameState !== "started") return;

    let speedNow = 0;
    let targetSpeed = randomInt(speed[0], speed[1]);

    const interval = setInterval(() => {
      targetSpeed = randomInt(speed[0], speed[1]);
    }, 1000);

    const frame = setInterval(() => {
      speedNow += (targetSpeed - speedNow) * 0.1;
      setPosition((prev) => {
        const next = prev + speedNow;
        return next >= raceLong ? raceLong : next;
      });

      const min = speed[0];
      const max = speed[1];
      const ratio = (speedNow - min) / (max - min);
      const animSpeed = 0.5 + ratio * 1.0;
      dotlottieSetSpeed(animSpeed);
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(frame);
    };
  }, [gameState, raceLong, speed]);

  useEffect(() => {
    let to: NodeJS.Timeout;

    if (gameState === "finished") {
      dotlottiePause();
      if (winner === name) {
        setPosition(curPosition + 2);
        dotlottieGoToAndStop(23);
      } else {
        setPosition(curPosition - 3);
        dotlottieGoToAndStop(0);
      }

      to = setTimeout(() => {
        setGameState("celebration");
      }, 3000);
    }

    return () => clearTimeout(to);
  }, [curPosition, gameState, name, setGameState, winner]);

  useEffect(() => {
    let to: NodeJS.Timeout;
    if (gameState === "celebration") {
      setPosition(raceLong + playerBoxWidth);
      dotlottiePlay();
      to = setTimeout(() => {
        setGameState("end");
      }, 2000);
    }

    return () => clearTimeout(to);
  }, [gameState, raceLong, setGameState]);

  useEffect(() => {
    if (gameState === "end") {
      dotlottieGoToAndStop(0);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === "not-started") {
      setPosition(0);
      setCurPosition(0);
    }
  }, [gameState]);

  useMotionValueEvent(x, "change", (latest) => {
    if (gameState === "started") {
      setCurrentFaster(latest);
      setCurPosition(latest);
      if (latest >= raceLong) {
        setWinner((prev) => {
          if (!prev) {
            setGameState("finished");

            return name;
          }
          return prev;
        });

        dotlottieGoToAndStop(0);
      }
    }
  });

  return (
    <motion.div
      key={name}
      className="absolute flex items-center justify-center"
      transition={{
        duration: ["not-started", "finished"].includes(gameState) ? 0 : 2,
        ease: "linear",
      }}
      animate={{ x: position }}
      style={{
        top:
          playerCount <= 2 && index === 0
            ? "25%"
            : index * playerGap - playerHeight / 4,
        height: `${playerHeight}px`,
        x,
      }}
    >
      <div
        className={cn(
          "relative flex justify-end items-center",
          "horse",
          themeId
        )}
        style={{ width: `${playerBoxWidth}px` }}
      >
        <div
          className={cn(
            "max-w-[130px] truncate overflow-hidden h-auto text-xs rounded-md px-3 mix-blend-difference text-white player-name"
          )}
        >
          {name}
        </div>
        {View}
      </div>
    </motion.div>
  );
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
