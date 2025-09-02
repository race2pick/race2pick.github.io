import { useArena } from "@/context/arena";
import { motion } from "motion/react";
import { useGameUI } from "@/context/game-ui";
import ShareModal from "./share-modal";
import GameUiContent from "./game-ui-content";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

export default function UI() {
  const { gameState, winner, retry, isCountdown, setPlayers } = useArena();
  const { rawNames, setRawNames } = useGameUI();

  const removeWinner = () => {
    const names = rawNames.split("\n");
    const newNames = names.filter((name) => name !== winner);

    setPlayers(newNames);

    setRawNames(newNames.join("\n"));
    retry();
  };

  return (
    <div className="w-full grow flex flex-col p-4">
      {gameState === "not-started" && !isCountdown && <GameUiContent />}
      <div className={cn("w-[100vw] flex justify-center p-6", {
        "absolute bottom-0": gameState === "started" || isCountdown
      })}>
        <a
          href="https://github.com/race2pick/race2pick.github.io"
          target="_blank"
          className="flex justify-center items-center gap-1 tex-sm"
        >
          <Icon icon="mdi:github" className="text-lg" /> GitHub
        </a>
      </div>

      {gameState === "finished" && winner && (
        <motion.div
          className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center text-white text-shadow-2xs text-4xl"
          animate={{ opacity: [0, 1], scale: [0, 1], rotate: [0, 360] }}
          transition={{ duration: 2 }}
        >
          {winner}
        </motion.div>
      )}

      {["celebration", "end"].includes(gameState) && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/25 flex items-center justify-center ">
          <motion.div
            className="flex flex-col justify-center items-center p-4 rounded-3xl bg-cyan-50/80 text-cyan-950 drop-shadow-2xl min-w-xs"
            animate={{
              y: [-window.innerHeight / 1.2, 0],
            }}
            transition={{ type: "spring", mass: 0.6 }}
          >
            <div className="text-2xl">The Winner Is</div>
            <div className="text-4xl font-bold">{winner}</div>
            <div className="flex flex-col gap-3 mt-7">
              <button
                className="bg-blue-500 rounded-2xl text-blue-100 p-1 hover:scale-110 transition-transform cursor-pointer"
                onClick={retry}
              >
                Retry
              </button>
              <button
                className="bg-orange-400 rounded-2xl text-orange-100 p-1 px-4 hover:scale-110 transition-transform cursor-pointer"
                onClick={removeWinner}
              >
                Remove From List
              </button>
            </div>
          </motion.div>
        </div>
      )}
      <ShareModal />
    </div>
  );
}
