import { useEffect, useRef, useState } from "react";
import { TrackSettingsContext } from "./track-settings-context";
import { useApp } from "../app";
import { defaultDistance, defaultSpeed } from "./constant";
import { compressData } from "@/lib/utils";
import { usePlayers } from "./players-context";

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

  const updateSearchParams = () => {
    const compressedData = compressData({
      players: players,
      distance: distance,
      speed: speed,
    });
    setDataSearchParams(compressedData);
  };

  useEffect(() => {
    if (isSearchParamReaded) return;

    const data = getDataSearchParams();

    if (!data) {
      setDistance(defaultDistance);
      setSpeed(defaultSpeed);
    } else {
      setDistance(data.distance);
      setSpeed(data.speed);
    }

    setIsSearchParamReaded(true);
  }, [getDataSearchParams, isSearchParamReaded]);

  return (
    <TrackSettingsContext.Provider
      value={{
        distance,
        speed,
        isSearchParamReaded,
        fasterCurrentPosition,
        setDistance,
        setSpeed,
        updateSearchParams,
      }}
    >
      {children}
    </TrackSettingsContext.Provider>
  );
}
