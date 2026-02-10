import { createContext, useContext, type RefObject } from "react";

interface TrackSettings {
  distance: number;
  speed: [number, number];
  isSearchParamReaded: boolean;
  fasterCurrentPosition: RefObject<number>;

  setDistance: (distance: number) => void;
  setSpeed: (speed: [number, number]) => void;
  updateSearchParams: () => void;
}

const TrackSettingsContext = createContext<TrackSettings | undefined>(undefined);

const useTrackSettings = () => {
  const context = useContext(TrackSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useTrackSettings must be used within a TrackSettingsProvider",
    );
  }
  return context;
};

export { TrackSettingsContext, useTrackSettings };
