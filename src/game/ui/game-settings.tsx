import { useArena, defaultDistance, defaultSpeed } from "@/context/arena";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

export default function GameSettings() {
  const { distance, speed, setSpeed, isSearchParamReaded, setDistance } =
    useArena();

  const [trackLong, setTrackLong] = useState(distance);
  const [trackSpeedMin, setTrackSpeedMin] = useState(speed[0]);
  const [trackSpeedMax, setTrackSpeedMax] = useState(speed[1]);

  const waitDistanceFromArena = useRef<boolean>(true);
  const waitSpeedFromArena = useRef<boolean>(true);

  const [trackLongDebounced] = useDebounceValue(trackLong, 200);
  const [trackSpeedMinDebounced] = useDebounceValue(trackSpeedMin, 200);
  const [trackSpeedMaxDebounced] = useDebounceValue(trackSpeedMax, 200);

  const resetDistance = () => {
    setTrackLong(defaultDistance);
  };

  const resetSpeed = () => {
    setTrackSpeedMin(defaultSpeed[0]);
    setTrackSpeedMax(defaultSpeed[1]);
  };

  useEffect(() => {
    setDistance(trackLongDebounced);
  }, [trackLongDebounced]);

  useEffect(() => {
    setSpeed([trackSpeedMinDebounced, trackSpeedMaxDebounced]);
  }, [trackSpeedMinDebounced, trackSpeedMaxDebounced]);

  useEffect(() => {
    if (!isSearchParamReaded || !waitDistanceFromArena.current) {
      return;
    }

    setTrackLong(distance);
    waitDistanceFromArena.current = false;
  }, [distance, isSearchParamReaded]);

  useEffect(() => {
    if (!isSearchParamReaded || !waitSpeedFromArena.current) {
      return;
    }

    setTrackSpeedMin(speed[0]);
    setTrackSpeedMax(speed[1]);
    waitSpeedFromArena.current = false;
  }, [speed, isSearchParamReaded]);

  const speedMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const current = parseInt(e.target.value);
      if (trackSpeedMax - current < 10) {
        setTrackSpeedMax(current + 10);
      }

      setTrackSpeedMin(parseInt(e.target.value));
    },
    [trackSpeedMax]
  );

  const speedMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const current = parseInt(e.target.value);
      if (current - trackSpeedMin < 10) {
        setTrackSpeedMin(current - 10);
      }
      setTrackSpeedMax(parseInt(e.target.value));
    },
    [trackSpeedMin]
  );

  return (
    <>
      <div className="flex flex-wrap basis-full md:basis-[60%] items-start justify-center md:justify-end gap-4 font-mono">
        <div className="flex flex-col items-center max-w-xs bg-gray-700 rounded-2xl shadow-md shadow-gray-600 overflow-hidden">
          <div className="pt-4 pb-2 px-4 bg-gray-800 w-full">
            <h2 className="text-sm font-medium tracking-widest">
              Track Length
            </h2>
            <p className="text-xs text-gray-400 font-mono">
              Control the distance the players must race
            </p>
          </div>
          <div className="flex grow p-4 gap-2 w-full">
            <input
              type="range"
              className="grow no"
              min={1000}
              max={5000}
              step={100}
              value={trackLong}
              onChange={(e) => setTrackLong(parseInt(e.target.value))}
            />
            <span>{trackLong}m</span>
          </div>
          <button
            className="bg-gray-600 text-gray-300 px-4 py-2 rounded-full hover:bg-gray-800 hover:drop-shadow-md transition-colors text-xs mb-4"
            onClick={resetDistance}
          >
            Reset
          </button>
        </div>
        <div className="relative flex flex-col items-center max-w-xs bg-gray-700 rounded-2xl shadow-md shadow-gray-600 overflow-hidden">
          <div className="pt-4 pb-2 px-4 bg-gray-800 w-full">
            <h2 className="text-sm font-medium tracking-widest">Horse Speed</h2>
            <p className="text-xs text-gray-400 font-mono">
              Set the min and max speed. Horses will run with random speeds
              within this range, changing over time so each runs differently.
            </p>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex grow p-4 gap-2 w-full">
              <div className="relative grow flex gap-2">
                <span className="shrink-0 text-sm">Min</span>
                <input
                  type="range"
                  className="w-full"
                  min={10}
                  max={90}
                  step={1}
                  value={trackSpeedMin}
                  onChange={speedMinChange}
                />
                <span className="shrink-0 text-sm">{trackSpeedMin}</span>
              </div>
            </div>
            <div className="flex grow p-4 gap-2 w-full">
              <div className="relative grow flex gap-2">
                <span className="shrink-0 text-sm">Max</span>
                <input
                  type="range"
                  className="-scale-100 w-full"
                  min={20}
                  max={100}
                  step={1}
                  value={trackSpeedMax}
                  onChange={speedMaxChange}
                />
              </div>
              <span className="shrink-0 text-sm">{trackSpeedMax}</span>
            </div>
          </div>

          <button
            className="bg-gray-600 text-gray-300 px-4 py-2 rounded-full hover:bg-gray-800 hover:drop-shadow-md transition-colors text-xs mb-4"
            onClick={resetSpeed}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
}
