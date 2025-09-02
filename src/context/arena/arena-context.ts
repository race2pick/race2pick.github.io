import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

export type GameState =
  | "not-started"
  | "started"
  | "finished"
  | "celebration"
  | "end";

export const playerBoxWidth = 200;

interface Arena {
  playerGap: number;
  playerHeight: number;
  gameState: GameState;
  distance: number;
  winner?: string;
  players: string[];
  isCameraMove: boolean;
  currentFaster: number;
  isCountdown: boolean;
  speed: [number, number];
  isSearchParamReaded: boolean;

  setPlayerGap: (playerGap: number) => void;
  setGameState: (gameState: GameState) => void;
  setDistance: (distance: number) => void;
  setWinner: Dispatch<SetStateAction<string | undefined>>;
  setPlayers: (players: string[]) => void;
  setIsCameraMove: (isCameraMove: boolean) => void;
  setCurrentFaster: (currentFaster: number) => void;
  startCountdown: () => void;
  setSpeed: (speed: [number, number]) => void;
  retry: () => void;
  newGame: () => void;
  updateSearchParams: () => void;
}

const ArenaContext = createContext<Arena | undefined>(undefined);

const useArena = () => {
  const context = useContext(ArenaContext);
  if (context === undefined) {
    throw new Error("useArena must be used within a ArenaProvider");
  }
  return context;
};

export { ArenaContext, useArena };
