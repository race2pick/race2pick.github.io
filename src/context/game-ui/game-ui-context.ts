import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

interface GameUI {
  rawNames: string;
  isShareModalOpen: boolean;
  gameSettingsKey: string;

  setRawNames: Dispatch<SetStateAction<string>>;
  setIsShareModalOpen: Dispatch<SetStateAction<boolean>>;
  setGameSettingsKey: Dispatch<SetStateAction<string>>;
}

const GameUiContext = createContext<GameUI | undefined>(undefined);

const useGameUI = () => {
  const context = useContext(GameUiContext);
  if (context === undefined) {
    throw new Error("useGameUI must be used within a GameUiProvider");
  }
  return context;
};

export { GameUiContext, useGameUI };
