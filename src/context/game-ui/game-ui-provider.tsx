import { useCallback, useEffect, useRef, useState } from "react";
import { GameUiContext } from "./game-ui-context";
import { useArena } from "../arena";
import { useDebounceCallback } from "usehooks-ts";

export function GameUiProvider({ children }: { children: React.ReactNode }) {
  const { players, setPlayers, isSearchParamReaded } = useArena();

  const [rawNames, setRawNames] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [gameSettingsKey, setGameSettingsKey] = useState(Date.now().toString());

  const waitPlayerFromArena = useRef<boolean>(true);

  const setNames = useCallback(
    (names: string[]) => {
      setPlayers(names);
    },
    [players]
  );

  const setNamesDebounced = useDebounceCallback(setNames, 250);

  useEffect(() => {
    if (waitPlayerFromArena.current) return;

    setNamesDebounced(rawNames.split("\n"));
  }, [rawNames, isSearchParamReaded]);

  useEffect(() => {
    if (!isSearchParamReaded || !waitPlayerFromArena.current) {
      return;
    }

    setRawNames(players.join("\n"));
    waitPlayerFromArena.current = false;
  }, [players, isSearchParamReaded]);

  return (
    <GameUiContext.Provider
      value={{
        rawNames,
        isShareModalOpen,
        gameSettingsKey,
        setRawNames,
        setIsShareModalOpen,
        setGameSettingsKey,
      }}
    >
      {children}
    </GameUiContext.Provider>
  );
}
