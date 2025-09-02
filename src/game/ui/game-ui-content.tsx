import { useGameUI } from "@/context/game-ui";
import GameSettings from "./game-settings";
import ListName from "./list-name";

export default function GameUiContent() {
  const { gameSettingsKey } = useGameUI();

  return (
    <div className="flex h-full w-full flex-wrap md:flex-nowrap gap-y-4 gap-x-4">
      <ListName />
      <GameSettings key={gameSettingsKey} />
    </div>
  );
}
