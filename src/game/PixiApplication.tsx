import { useArena } from "@/context/arena";
import { useRef } from "react";
import { useContainerSize } from "./hooks/useContainerSize";
import { HORSE_HEIGHT } from "./static/horse";
import { Application, extend } from "@pixi/react";
import { Arena } from "./arena";
import {
  AnimatedSprite,
  Container,
  Graphics,
  Sprite,
  Text,
  TilingSprite,
} from "pixi.js";

extend({
  Container,
  Graphics,
  Sprite,
  TilingSprite,
  AnimatedSprite,
  Text,
});

export default function PixiApplication() {
  const { players } = useArena();
  const ref = useRef<HTMLDivElement>(null);
  const size = useContainerSize(ref);

  return (
    <div
      ref={ref}
      className="relative w-full max-h-[80vh]"
      style={{
        minHeight: `${HORSE_HEIGHT * 6}px`,
        height: `${HORSE_HEIGHT * (players.length || 2)}px`,
      }}
    >
      <Application
        width={size.width}
        height={size.height}
        resizeTo={ref}
        antialias
        autoDensity
        backgroundColor="#8b5a2b"
        autoStart
      >
        <Arena size={size} />
      </Application>
    </div>
  );
}
