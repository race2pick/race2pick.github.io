import { useTrackLength } from "@/game/hooks/useTrackLength";
import { GREEN_LAND_HEIGHT } from "@/game/static/arena";
import { FillGradient } from "pixi.js";

export default function Land({ trackheight }: { trackheight: number }) {
  const { trackLengthWithBuffer } = useTrackLength();

  return (
    <>
      {/* desert land */}
      <pixiGraphics
        x={0}
        y={0}
        draw={(graphics) => {
          graphics.clear();
          graphics.rect(0, 0, trackLengthWithBuffer, trackheight).fill(
            new FillGradient({
              type: "linear",
              start: { x: 0, y: 0 },
              end: { x: 0, y: trackheight },
              colorStops: [
                {
                  offset: 0,
                  color: "#8b5a2b",
                },
                {
                  offset: 0.7,
                  color: "#704321",
                },
                {
                  offset: 1,
                  color: "#5c3220",
                },
              ],
            }),
          );
        }}
      />

      {/* green land */}
      <pixiGraphics
        x={0}
        y={0}
        draw={(graphics) => {
          graphics.clear();
          graphics.rect(0, 0, trackLengthWithBuffer, GREEN_LAND_HEIGHT).fill(
            new FillGradient({
              type: "linear",
              start: { x: 0, y: 0 },
              end: { x: 0, y: GREEN_LAND_HEIGHT },
              colorStops: [
                {
                  offset: 0,
                  color: "#47c45a",
                },
                {
                  offset: 0.7,
                  color: "#379a47",
                },
                {
                  offset: 1,
                  color: "#379a47",
                },
              ],
            }),
          );
        }}
      />
    </>
  );
}
