import { createContext, useContext } from "react";

interface Players {
  players: string[];
  setPlayers: (players: string[]) => void;
}

const PlayersContext = createContext<Players | undefined>(undefined);

const usePlayers = () => {
  const context = useContext(PlayersContext);
  if (context === undefined) {
    throw new Error("usePlayers must be used within a PlayersProvider");
  }
  return context;
};

export { PlayersContext, usePlayers };
