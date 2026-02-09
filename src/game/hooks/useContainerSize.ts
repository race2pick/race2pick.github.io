import { useEffect, useState, type RefObject } from "react";

export function useContainerSize(container?: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({
    width: container?.current?.clientWidth ?? window.innerWidth,
    height: container?.current?.clientHeight ?? window.innerHeight,
  });

  useEffect(() => {
    const el = container?.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [container]);

  return size;
}
