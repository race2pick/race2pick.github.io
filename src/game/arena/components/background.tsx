import { HORSE_START_X, HORSE_WIDTH } from "@/game/static/horse";
import Land from "./land";
import Grass from "./grass";
import GrassFaded from "./grass-faded";
import StartFinishLine from "./start-finish-line";
import Puddle from "./puddle";
import { useArena } from "@/context/arena";

export default function Background({ trackheight }: { trackheight: number }) {
  const {distance} = useArena();
  return (
    <pixiContainer x={0} y={0} height={trackheight}>
      <Land trackheight={trackheight} />

      {/* start line */}
      <StartFinishLine
        x={HORSE_START_X + HORSE_WIDTH - 22}
        trackHeight={trackheight}
      />

      {/* finish line */}
      <StartFinishLine
        x={distance + HORSE_WIDTH}
        trackHeight={trackheight}
      />

      <Grass />
      <GrassFaded />
      <Puddle trackheight={trackheight} />
    </pixiContainer>
  );
}
