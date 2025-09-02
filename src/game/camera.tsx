import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useArena, playerBoxWidth } from "@/context/arena";

export default function Camera({ children }: React.PropsWithChildren) {
  const { distance, gameState, currentFaster, playerHeight, players } =
    useArena();

  const [isMove, setIsMove] = useState(false);
  const [cameraX, setCameraX] = useState(0);

  const finalX = useMemo(
    () => distance - window.innerWidth + playerBoxWidth + 16,
    [distance]
  );

  useEffect(() => {
    if (gameState === "started") {
      const screenWidth = window.innerWidth;
      if (distance >= screenWidth - playerBoxWidth) {
        setIsMove(currentFaster > screenWidth / 2);
      }
    }
  }, [distance, currentFaster, gameState]);

  useEffect(() => {
    if (gameState === "started" && isMove) {
      const screenWidth = window.innerWidth;

      // camera follows leader, centered until max scroll
      let nextMove = currentFaster - screenWidth / 2 + playerBoxWidth / 2;

      // clamp to boundaries
      if (nextMove < 0) nextMove = 0;
      if (nextMove > finalX) nextMove = finalX;

      setCameraX(nextMove);
    }
  }, [currentFaster, finalX, gameState, isMove]);

  useEffect(() => {
    if (gameState === "not-started") {
      setCameraX(0);
      setIsMove(false);
    }
  }, [gameState]);

  return (
    <motion.div
      className="relative max-h-[80svh]"
      style={{
        minHeight: `${playerHeight * 8}px`,
        height: `${playerHeight * (players.length || 2)}px`,
      }}
      animate={{ x: -cameraX }}
      transition={{
        ease: "linear",
        duration: gameState === "not-started" ? 0.5 : 1.5,
      }}
    >
      {children}
    </motion.div>
  );
}
