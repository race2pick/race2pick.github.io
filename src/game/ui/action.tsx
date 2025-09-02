import { useArena } from "@/context/arena";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function Action() {
  const [count, setCount] = useState(-1);
  const {
    setGameState,
    gameState,
    players,
    startCountdown,
    updateSearchParams,
  } = useArena();

  const canStart = players.length >= 2;

  const start = () => {
    updateSearchParams();
    setCount(3);
    startCountdown();
  };

  useEffect(() => {
    if (count < 0 || !canStart) return;

    const interval = setInterval(() => {
      setCount((prev) => {
        const next = prev - 1;
        if (next < -1) {
          return -1;
        }
        return next;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [count, gameState, canStart]);

  useEffect(() => {
    if (gameState === "not-started" && count === 0 && canStart) {
      setGameState("started");
    }
  }, [gameState, count, canStart]);

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {gameState === "not-started" && count < 0 && (
        <button
          className={cn("rounded-full bg-gray-900/30 size-28 text-white", {
            "cursor-pointer hover:bg-blue-700/50": canStart,
            "opacity-20": !canStart,
          })}
          onClick={canStart ? start : undefined}
        >
          🏁 Start 🏁
        </button>
      )}
      {count >= 0 && (
        <motion.div
          key={count}
          className="rounded-full text-7xl flex items-center justify-center"
          animate={{ scale: [0, 1, 2], opacity: [0, 1, 0] }}
          transition={{ duration: 1 }}
        >
          {count === 0 ? "GO!" : count}
        </motion.div>
      )}
    </div>
  );
}
