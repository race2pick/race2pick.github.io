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

interface GameFlow {
  gameState: GameState;
  winner?: string;
  isCountdown: boolean;

  setGameState: (gameState: GameState) => void;
  setWinner: Dispatch<SetStateAction<string | undefined>>;
  startCountdown: () => void;
  retry: () => void;
  newGame: () => void;
}

const GameFlowContext = createContext<GameFlow | undefined>(undefined);

const useGameFlow = () => {
  const context = useContext(GameFlowContext);
  if (context === undefined) {
    throw new Error("useGameFlow must be used within a GameFlowProvider");
  }
  return context;
};

export { GameFlowContext, useGameFlow };
