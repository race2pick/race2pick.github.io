import { HORSE_START_X, HORSE_WIDTH } from "@/game/static/horse";
import Land from "./land";
import Grass from "./grass";
import GrassFaded from "./grass-faded";
import StartFinishLine from "./start-finish-line";
import Puddle from "./puddle";

export default function Background({ trackheight }: { trackheight: number }) {
  return (
    <pixiContainer x={0} y={0} height={trackheight}>
      <Land trackheight={trackheight} />
      <StartFinishLine
        x={HORSE_START_X + HORSE_WIDTH - 8}
        trackHeight={trackheight}
      />

      <Grass />
      <GrassFaded />
      <Puddle trackheight={trackheight} />
    </pixiContainer>
  );
}
