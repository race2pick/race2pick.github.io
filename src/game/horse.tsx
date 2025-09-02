import { useArena, playerBoxWidth } from "@/context/arena";
import { cn } from "@/lib/utils";
import { type DotLottie, DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion, useMotionValue, useMotionValueEvent } from "motion/react";
import { useEffect, useMemo, useState } from "react";

const anim = new URL("../assets/horse.lottie", import.meta.url).href;

type ThemeKey =
  | "default"
  | `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13}`;

const colors: Record<ThemeKey, string> = {
  default: "#121212",
  "1": "#ffffff",
  "2": "#6666FF",
  "3": "#55AFE7",
  "4": "#24A8AF",
  "5": "#FF6699",
  "6": "#E7B549",
  "7": "#DE524C",
  "8": "#767FAD",
  "9": "#FF0000",
  "10": "#FFFA05",
  "11": "#0019FF",
  "12": "#2EFF00",
  "13": "#00FFED",
};

interface HorseProps {
  name: string;
  index: number;
}

export default function Horse({ name, index }: HorseProps) {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);
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

  const dotLottieRefCallback = (dotLottie: DotLottie) => {
    setDotLottie(dotLottie);
  };

  const themeId = useMemo(() => {
    const themes: ThemeKey[] = [
      "default",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
    ];
    const cycleIndex = index % themes.length;
    return themes[cycleIndex];
  }, [index]);

  useEffect(() => {
    if (gameState === "not-started") {
      dotLottie?.pause();
      dotLottie?.setFrame(0);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === "started") {
      dotLottie?.play();
      dotLottie?.setSpeed(0.5);
      const boost = randomInt(speed[0] * 7, speed[1] * 7);
      setPosition(boost);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "started") return;

    let speedNow = 0;
    let targetSpeed = randomInt(speed[0], speed[1]);

    const interval = setInterval(() => {
      targetSpeed = randomInt(speed[0], speed[1]); // random tujuan baru
    }, 1000); // tiap 2 detik ganti target

    const frame = setInterval(() => {
      // Smooth menuju target
      speedNow += (targetSpeed - speedNow) * 0.1;
      setPosition((prev) => {
        const next = prev + speedNow;
        return next >= raceLong ? raceLong : next;
      });

      // Update animasi berdasarkan speed
      if (dotLottie) {
        const min = speed[0];
        const max = speed[1];
        const ratio = (speedNow - min) / (max - min); // normalize ke 0..1
        const animSpeed = 0.5 + ratio * 1.0; // 0.5..1.5
        dotLottie.setSpeed(animSpeed);
      }
    }, 100); // update tiap 0.1 detik

    return () => {
      clearInterval(interval);
      clearInterval(frame);
    };
  }, [gameState, raceLong, speed]);

  useEffect(() => {
    let to: NodeJS.Timeout;

    if (gameState === "finished") {
      dotLottie?.pause();
      if (winner === name) {
        setPosition(curPosition + 2);
        dotLottie?.setFrame(5);
      } else {
        setPosition(curPosition - 3);
        dotLottie?.setFrame(0);
      }

      to = setTimeout(() => {
        setGameState("celebration");
      }, 3000);
    }

    return () => clearTimeout(to);
  }, [gameState, winner]);

  useEffect(() => {
    let to: NodeJS.Timeout;
    if (gameState === "celebration") {
      setPosition(raceLong + playerBoxWidth);
      dotLottie?.play();
      to = setTimeout(() => {
        setGameState("end");
      }, 2000);
    }

    return () => clearTimeout(to);
  }, [gameState]);

  useEffect(() => {
    if (gameState === "end") {
      dotLottie?.pause();
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === "not-started") {
      setPosition(0);
      setCurPosition(0);
    }
  }, [gameState]);

  useEffect(() => {
    setCurrentFaster(position);
  }, [position]);

  useMotionValueEvent(x, "change", (latest) => {
    if (gameState === "started") {
      setCurPosition(latest);
      if (latest >= raceLong) {
        setWinner((prev) => {
          if (!prev) {
            setGameState("finished");

            return name;
          }
          return prev;
        });

        dotLottie?.pause();
        dotLottie?.setFrame(0);
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
        className="relative flex justify-end items-center"
        style={{ width: `${playerBoxWidth}px` }}
      >
        <div
          className={cn(
            "max-w-[130px] truncate overflow-hidden h-auto text-xs rounded-md px-3 mix-blend-difference text-white"
          )}
          style={{
            backgroundColor: `color-mix(in srgb, ${colors[themeId]} 25%, transparent)`,
          }}
        >
          {name}
        </div>
        <DotLottieReact
          src={anim}
          loop
          dotLottieRefCallback={dotLottieRefCallback}
          autoplay={false}
          themeId={themeId}
          style={{ height: `${playerHeight}px`, width: "70px", flexShrink: 0 }}
        />
      </div>
    </motion.div>
  );
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
