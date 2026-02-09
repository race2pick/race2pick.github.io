import { ArenaProvider } from "@/context/arena";
import GameUi from "./ui/game-ui";
import PixiApplication from "./PixiApplication";

export default function Game() {
  return (
    <ArenaProvider>
      <div className="h-svh max-w-svw overflow-x-hidden flex flex-col">
        <div className="relative w-full overflow-hidden shrink-0">
          <PixiApplication />
        </div>
        <GameUi />
      </div>
    </ArenaProvider>
  );
}
