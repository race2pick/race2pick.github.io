import { useCallback, useEffect, useMemo, useState } from "react";
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
  const { setDistance, setSpeed } = useTrackSettings();
  const { clearSearchParams } = useApp();

  const startCountdown = useCallback(() => {
    setIsCountdown(true);
  }, []);

  const retry = useCallback(() => {
    setGameState("end");
    setIsCountdown(false);
  }, []);

  const newGame = useCallback(() => {
    clearSearchParams();
    retry();
    setSpeed(defaultSpeed);
    setDistance(defaultDistance);
    setPlayers([]);
  }, [clearSearchParams, retry, setSpeed, setDistance, setPlayers]);

  useEffect(() => {
    if (!isCountdown) return;

    if (gameState !== "not-started") {
      setIsCountdown(false);
    }
  }, [gameState, isCountdown]);

  useEffect(() => {
    let to: NodeJS.Timeout;

    if (gameState === "finished") {
      to = setTimeout(() => {
        setGameState("celebration");
      }, 3000);
    }

    return () => clearTimeout(to);
  }, [gameState, setGameState]);

  const value = useMemo(
    () => ({
      gameState,
      winner,
      isCountdown,
      setGameState,
      setWinner,
      startCountdown,
      retry,
      newGame,
    }),
    [gameState, winner, isCountdown, startCountdown, retry, newGame],
  );

  return (
    <GameFlowContext.Provider value={value}>
      {children}
    </GameFlowContext.Provider>
  );
}
