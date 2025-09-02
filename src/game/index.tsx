import { ArenaProvider } from "@/context/arena";
import Camera from "./camera";
import Arena from "./arena";
import Action from "./ui/action";
import GameUi from "./ui/game-ui";

export default function Game() {
  return (
    <ArenaProvider>
      <div className="h-svh">
        <div className="relative w-full overflow-hidden shrink-0">
          <Camera>
            <Arena />
          </Camera>
          <Action />
        </div>
        <GameUi />
      </div>
    </ArenaProvider>
  );
}
