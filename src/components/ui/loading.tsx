import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export default function Loading() {
  const [dots, setDots] = useState([false, false, false]);
  const y = useMotionValue(0);
  const x = useMotionValue(0);
  const rotate = useMotionValue(0);
  const scale = useMotionValue(1);

  const springY = useSpring(y, { stiffness: 200, damping: 12 });
  const springX = useSpring(x, { stiffness: 120, damping: 12 });
  const springRotate = useSpring(rotate, { stiffness: 120, damping: 10 });
  const springScale = useSpring(scale, { stiffness: 150, damping: 10 });

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const animateForwardUp = () => {
      y.set(-40);
      x.set(20);
      rotate.set(-15);
      scale.set(1.1);

      timeout = setTimeout(() => {
        y.set(0);
        x.set(40);
        rotate.set(15);
        scale.set(1);

        timeout = setTimeout(animateBackward, 600);
      }, 300);
    };

    const animateBackward = () => {
      y.set(-10);
      x.set(0);
      rotate.set(-15);
      scale.set(1.05);

      timeout = setTimeout(() => {
        y.set(0);
        rotate.set(0);
        scale.set(1);

        timeout = setTimeout(animateForwardUp, 400);
      }, 300);
    };

    animateForwardUp();

    return () => clearTimeout(timeout);
  }, [y, x, rotate, scale]);

  useEffect(() => {
    let dt = 0;
    const interval = setInterval(() => {
      const newDots = Array(3).fill(true, 0, dt).fill(false, dt);

      setDots(newDots);

      dt = (dt + 1) % 4;
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-8 h-svh w-full items-center justify-center">
      <div className="-translate-x-[50%]">
        <motion.svg
          fill="none"
          viewBox="0 0 152 170"
          className="w-10"
          style={{
            y: springY,
            x: springX,
            rotate: springRotate,
            scale: springScale,
          }}
        >
          <path
            d="M151.079 47.793v75.05l-28.144 9.381-28.988-51.597c-2.439-4.315-9.287-2.158-8.537 2.908l9.382 86.214L.979 132.224l10.789-75.613A64.918 64.918 0 0176.029.887h75.05L136.257 23.12c8.818 4.785 14.822 13.978 14.822 24.673z"
            fill="#99A1AF"
          />
        </motion.svg>
      </div>
      <p className="flex items-end gap-1 font-mono">
        <span>Loading</span>
        {dots.map((val, i) => (
          <motion.span
            animate={{ scale: val ? 1 : 0 }}
            className={cn("size-[3px] rounded-full mb-1 bg-white", {})}
            key={i}
          />
        ))}
      </p>
    </div>
  );
}
