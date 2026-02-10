import { useEffect, useState } from "react";
import { PlayersContext } from "./players-context";
import { useApp } from "../app";

const defaultPlayers = `Player 1\nPlayer 2\nPlayer 3\nPlayer 4`;

export function PlayersProvider({ children }: { children: React.ReactNode }) {
  const [players, _setPlayers] = useState<string[]>([]);
  const [isReaded, setIsReaded] = useState(false);

  const { getDataSearchParams } = useApp();

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

  useEffect(() => {
    if (isReaded) return;

    const data = getDataSearchParams();

    if (!data) {
      _setPlayers(defaultPlayers.split("\n"));
    } else {
      setPlayers(data.players);
    }

    setIsReaded(true);
  }, [getDataSearchParams, isReaded]);

  return (
    <PlayersContext.Provider value={{ players, setPlayers }}>
      {children}
    </PlayersContext.Provider>
  );
}
