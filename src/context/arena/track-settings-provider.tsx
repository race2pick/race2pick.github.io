import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TrackSettingsContext } from "./track-settings-context";
import { useApp } from "../app";
import { defaultDistance, defaultSpeed } from "./constant";
import { compressData } from "@/lib/utils";
import { usePlayers } from "./players-context";

function normalizedDistance(distance: number) {
  if (distance >= 10000) return 1000;

  if (distance > 1000) return distance / 10;

  return distance;
}

export function TrackSettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [distance, setDistance] = useState(defaultDistance);
  const [speed, setSpeed] = useState<[number, number]>(defaultSpeed);
  const [isSearchParamReaded, setIsSearchParamReaded] = useState(false);

  const fasterCurrentPosition = useRef(0);

  const { players } = usePlayers();
  const { setDataSearchParams, getDataSearchParams } = useApp();

  const updateSearchParams = useCallback(() => {
    const compressedData = compressData({
      players: players,
      distance: distance,
      speed: speed,
    });
    setDataSearchParams(compressedData);
  }, [players, distance, speed, setDataSearchParams]);

  useEffect(() => {
    if (isSearchParamReaded) return;

    const data = getDataSearchParams();

    if (!data) {
      setDistance(defaultDistance);
      setSpeed(defaultSpeed);
    } else {
      setDistance(normalizedDistance(data.distance));
      setSpeed(data.speed);
    }

    setIsSearchParamReaded(true);
  }, [getDataSearchParams, isSearchParamReaded]);

  const value = useMemo(
    () => ({
      distance,
      speed,
      isSearchParamReaded,
      fasterCurrentPosition,
      setDistance,
      setSpeed,
      updateSearchParams,
    }),
    [distance, speed, isSearchParamReaded, updateSearchParams]
  );

  return (
    <TrackSettingsContext.Provider value={value}>
      {children}
    </TrackSettingsContext.Provider>
  );
}
