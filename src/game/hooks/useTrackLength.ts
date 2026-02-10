import { useTrackSettings } from "@/context/arena";
import { useMemo } from "react";

export function useTrackLength() {
  const { distance } = useTrackSettings();

  const trackLengthWithBuffer = useMemo(
    () => distance + window.innerWidth,
    [distance],
  );

  return { trackLength: distance, trackLengthWithBuffer };
}
