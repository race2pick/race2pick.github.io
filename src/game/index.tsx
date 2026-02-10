import {
  PlayersProvider,
  TrackSettingsProvider,
  GameFlowProvider,
} from "@/context/arena";
import GameUi from "./ui/game-ui";
import PixiApplication from "./PixiApplication";
import Action from "./ui/action";

export default function Game() {
  return (
    <PlayersProvider>
      <TrackSettingsProvider>
        <GameFlowProvider>
          <div className="h-svh max-w-svw overflow-x-hidden flex flex-col">
            <div className="relative w-full overflow-hidden shrink-0">
              <PixiApplication />
              <Action />
            </div>
            <GameUi />
          </div>
        </GameFlowProvider>
      </TrackSettingsProvider>
    </PlayersProvider>
  );
}
