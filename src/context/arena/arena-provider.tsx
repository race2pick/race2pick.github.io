import { useEffect, useState } from "react";
import { ArenaContext, type GameState } from "./arena-context";
import { compressData } from "@/lib/utils";
import { useApp } from "../app";

const playerHeight = 50;
export const defaultDistance = 2000;
export const defaultSpeed: [number, number] = [30, 50];
const defaultPlayers = `Player 1\nPlayer 2\nPlayer 3\nPlayer 4`;

export function ArenaProvider({ children }: { children: React.ReactNode }) {
  const [playerGap, setPlayerGap] = useState(0);
  const [gameState, setGameState] = useState<GameState>("not-started");
  const [distance, setDistance] = useState(defaultDistance);
  const [isCameraMove, setIsCameraMove] = useState(false);
  const [winner, setWinner] = useState<string>();
  const [currentFaster, _setCurrentFaster] = useState(0);
  const [isCountdown, setIsCountdown] = useState(false);
  const [speed, setSpeed] = useState<[number, number]>(defaultSpeed);
  const [players, _setPlayers] = useState<string[]>([]);
  const [isSearchParamReaded, setIsSearchParamReaded] = useState(false);

  const { setDataSearchParams, getDataSearchParams, clearSearchParams } =
    useApp();

  const setPlayers = (names: string[]) => {
    if (!names?.length) {
      _setPlayers([]);
      return;
    }

    const uniqueArr: string[] = [...new Set(names)];
    const cleanNames = uniqueArr
      .map((name) => name.trim())
      .filter((name) => !!name);

    _setPlayers(cleanNames);
  };

  const setCurrentFaster = (current: number) => {
    _setCurrentFaster((prev) => {
      if (current > prev) return current;
      return prev;
    });
  };

  const startCountdown = () => {
    setIsCountdown(true);
  };

  const retry = () => {
    setGameState("not-started");
    setWinner(undefined);
    _setCurrentFaster(0);
    setIsCameraMove(false);
    setIsCountdown(false);
  };

  const updateSearchParams = () => {
    const compressedData = compressData({
      players: players,
      distance: distance,
      speed: speed,
    });

    setDataSearchParams(compressedData);
  };

  const newGame = () => {
    clearSearchParams();
    retry();
    setSpeed(defaultSpeed);
    setDistance(defaultDistance);
    setPlayers([]);
  };

  useEffect(() => {
    if (isSearchParamReaded) return;

    const data = getDataSearchParams();

    if (!data) {
      _setPlayers(defaultPlayers.split("\n"));
      setDistance(defaultDistance);
      setSpeed(defaultSpeed);
    } else {
      setPlayers(data.players);
      setDistance(data.distance);
      setSpeed(data.speed);
    }

    setIsSearchParamReaded(true);
  }, [isSearchParamReaded]);

  useEffect(() => {
    if (!isCountdown) return;

    if (gameState !== "not-started") {
      setIsCountdown(false);
    }
  }, [gameState, isCountdown]);

  return (
    <ArenaContext.Provider
      value={{
        playerHeight,
        playerGap,
        gameState,
        distance,
        winner,
        players,
        isCameraMove,
        currentFaster,
        isCountdown,
        speed,
        isSearchParamReaded,

        setPlayerGap,
        setGameState,
        setDistance,
        setWinner,
        setPlayers,
        setIsCameraMove,
        setCurrentFaster,
        startCountdown,
        setSpeed,
        retry,
        updateSearchParams,
        newGame,
      }}
    >
      {children}
    </ArenaContext.Provider>
  );
}
