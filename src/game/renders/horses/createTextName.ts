import { Container, Graphics, Text } from "pixi.js";

export default function createTextName(name: string, color: string) {
  const container = new Container({ label: `name-${name}` });
  container.x = -40;
  container.y = 0;

  const bg = new Graphics();

  const paddingX = 6;
  const paddingY = 3;
  const maxWidth = 105;

  const text = new Text({
    text: name,
    anchor: { x: 0, y: 0.5 },
    style: {
      fontSize: 12,
      fontFamily: `ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
      fontWeight: "400",
      fill: "white",
      stroke: { color: "black", width: 0.5 },
      wordWrap: false,
    },
    textureStyle: {
      scaleMode: "nearest",
    },
  });

  // Clamp width to max, enable ellipsis-like truncation
  if (text.width > maxWidth) {
    let truncated = name;
    text.text = truncated;
    while (text.width > maxWidth && truncated.length > 1) {
      truncated = truncated.slice(0, -1);
      text.text = truncated + "..";
    }
  }

  const textW = text.width;
  const textH = text.height;
  const boxW = textW + paddingX * 2;
  const boxH = textH + paddingY * 2;

  // Position text inside box with padding (right-aligned to origin)
  text.x = -boxW + paddingX;

  // Draw rounded background centered on text

  if (bg) {
    bg.clear();
    bg.roundRect(-boxW, -boxH / 2, boxW, boxH, 4).fill({
      color: color,
      alpha: 0.2,
    });
  }

  container.addChild(bg);
  container.addChild(text);

  return container;
}
