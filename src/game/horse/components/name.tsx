import { HORSE_HEIGHT } from "@/game/static/horse";
import { extend } from "@pixi/react";
import { Container, Graphics, Text } from "pixi.js";
import { useRef } from "react";

extend({
  Container,
  Text,
});

export default function Name({
  name,
  horseColor,
}: {
  name: string;
  horseColor: string;
}) {
  const bgRef = useRef<Graphics | null>(null);

  return (
    <pixiContainer x={-4} y={HORSE_HEIGHT / 2}>
      <pixiGraphics
        ref={(ref: Graphics | null) => {
          if (ref) {
            // Store ref so text can trigger redraw
            bgRef.current = ref;
          }
        }}
        draw={(g: Graphics) => {
          g.clear();
        }}
      />
      <pixiText
        text={name}
        anchor={{ x: 0, y: 0.5 }}
        style={{
          fontSize: 12,
          fontFamily: `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
          fontWeight: "400",
          fill: "white",
          stroke: { color: "black", width: 0.5 },
          wordWrap: false,
        }}
        ref={(ref: Text | null) => {
          if (ref) {
            const paddingX = 6;
            const paddingY = 3;
            const maxWidth = 90;

            if (ref.textureStyle?.scaleMode) {
              ref.textureStyle.scaleMode = "nearest"; // = { scaleMode: "nearest" };
            }

            // Clamp width to max, enable ellipsis-like truncation
            if (ref.width > maxWidth) {
              let truncated = name;
              ref.text = truncated;
              while (ref.width > maxWidth && truncated.length > 1) {
                truncated = truncated.slice(0, -1);
                ref.text = truncated + "..";
              }
            }

            const textW = ref.width;
            const textH = ref.height;
            const boxW = textW + paddingX * 2;
            const boxH = textH + paddingY * 2;

            // Position text inside box with padding (right-aligned to origin)
            ref.x = -boxW + paddingX;

            // Draw rounded background centered on text
            const bg = bgRef.current;
            if (bg) {
              bg.clear();
              bg.roundRect(-boxW, -boxH / 2, boxW, boxH, 4).fill({
                color: horseColor,
                alpha: 0.3,
              });
            }
          }
        }}
      />
    </pixiContainer>
  );
}
