import { useEffect, useState } from "react";
import { GameFlowContext, type GameState } from "./game-flow-context";
import { usePlayers } from "./players-context";
import { useTrackSettings } from "./track-settings-context";
import { useApp } from "../app";
import { defaultDistance, defaultSpeed } from "./constant";

export function GameFlowProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>("not-started");
  const [winner, setWinner] = useState<string>();
  const [isCountdown, setIsCountdown] = useState(false);

  const { setPlayers } = usePlayers();
  const { setDistance, setSpeed, fasterCurrentPosition } = useTrackSettings();
  const { clearSearchParams } = useApp();

  const startCountdown = () => {
    setIsCountdown(true);
  };

  const retry = () => {
    setGameState("not-started");
    setWinner(undefined);
    setIsCountdown(false);
    fasterCurrentPosition.current = 0;
  };

  const newGame = () => {
    clearSearchParams();
    retry();
    setSpeed(defaultSpeed);
    setDistance(defaultDistance);
    setPlayers([]);
  };

  useEffect(() => {
    if (!isCountdown) return;

    if (gameState !== "not-started") {
      setIsCountdown(false);
    }
  }, [gameState, isCountdown]);

  return (
    <GameFlowContext.Provider
      value={{
        gameState,
        winner,
        isCountdown,
        setGameState,
        setWinner,
        startCountdown,
        retry,
        newGame,
      }}
    >
      {children}
    </GameFlowContext.Provider>
  );
}
