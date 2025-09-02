import { GameUiProvider } from "@/context/game-ui";
import UI from "./ui";

export default function GameUi() {
  return (
    <GameUiProvider>
      <UI />
    </GameUiProvider>
  );
}
