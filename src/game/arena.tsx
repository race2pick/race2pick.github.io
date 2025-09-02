import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useArena, playerBoxWidth } from "@/context/arena";

import Horse from "./horse";

export default function Arena() {
  const arenaRef = useRef<HTMLDivElement>(null);
  const finishLineRef = useRef<HTMLDivElement>(null);

  const { players, setPlayerGap, playerHeight, distance } = useArena();

  useEffect(() => {
    if (!arenaRef.current) return;

    const arenaHeight = arenaRef.current.clientHeight;

    const arenaAreaUsage =
      arenaHeight - (playerHeight - arenaHeight / (players?.length || 1));
    const space = arenaAreaUsage / (players?.length || 1);

    setPlayerGap(space);
  }, [players.length]);

  return (
    <>
      <motion.div
        className="absolute ground-grass top-0 left-0 h-full min-w-full"
        style={{ width: distance + playerBoxWidth + 50 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      ></motion.div>
      <motion.div
        className="finish absolute top-[34px] bottom-0 opacity-50"
        style={{ left: playerBoxWidth - 5 }}
      ></motion.div>
      <motion.div
        ref={finishLineRef}
        className="finish absolute top-[34px] bottom-0 opacity-50"
        style={{ left: distance }}
      ></motion.div>
      <div className="absolute top-[32px] bottom-0 left-0 right-0">
        <div ref={arenaRef} className="relative top-0 left-0 w-full h-full">
          {players.map((name, i) => {
            return <Horse key={name} name={name} index={i} />;
          })}
        </div>
      </div>
      <div
        className="absolute bottom-0 h-6 bg-linear-to-t from-black to-transparent"
        style={{ width: distance * 1.5 + playerBoxWidth + 50 }}
      />
    </>
  );
}
