import { useGameFlow, usePlayers, useTrackSettings } from "@/context/arena";
import { useCallback, useEffect, useRef } from "react";
import { useContainerSize } from "./hooks/useContainerSize";
import { HORSE_HEIGHT } from "./static/horse";

import { Application } from "pixi.js";
import { createRender } from "./renders";
import type { World } from "./ecs/world";
import renderArena from "./renders/arena/arena.render";
import gameLoop from "./ecs/game-loop";
import { createHorse, updateHorse } from "./ecs/factories/horse";
import renderHorses from "./renders/horses/horses.render";
import useSyncStateToGame from "./hooks/useSyncStateToGame";
import type { Render } from "./renders/types";
import createWorld from "./ecs/factories/world";
import removeEntity from "./ecs/factories/remove-entity";

export default function PixiApplication() {
  const { players } = usePlayers();
  const appContainerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const worldRef = useRef<World | null>(null);
  const renderRef = useRef<Render | null>(null);

  const size = useContainerSize(appContainerRef);

  const { distance, speed } = useTrackSettings();
  const { setGameState, setWinner } = useGameFlow();
  const distanceRef = useRef(distance);
  distanceRef.current = distance;

  useSyncStateToGame(worldRef.current);

  const syncTrackSettings = useCallback((trackDistance: number) => {
    if (!worldRef.current || !renderRef.current) {
      return;
    }

    worldRef.current.gameConfig.distance = trackDistance;
    renderArena(worldRef.current, renderRef.current);
  }, []);

  const syncPlayers = useCallback((players: string[]) => {
    if (!worldRef.current || !renderRef.current || !appContainerRef.current)
      return;

    const existingHorseMap = new Map(worldRef.current.horses);
    const playerSet = new Set(players);

    /**
     * Remove horses that are not in the players list
     */
    existingHorseMap.forEach((entityId, name) => {
      if (!playerSet.has(name)) {
        removeEntity(worldRef.current!, entityId);
      }
    });

    worldRef.current.horses.clear();

    players.forEach((name, index) => {
      const existing = existingHorseMap.get(name);

      if (existing) {
        updateHorse(worldRef.current!, existing, {
          name,
          index,
          playerLength: players.length,
        });

        return;
      }

      createHorse(worldRef.current!, {
        name,
        index,
        playerLength: players.length,
      });
    });

    renderHorses(worldRef.current, renderRef.current.horseView);
  }, []);

  const syncArenaHeight = useCallback(() => {
    if (
      !worldRef.current ||
      !renderRef.current ||
      !appContainerRef.current ||
      !appRef.current
    )
      return;

    if (
      worldRef.current.screen.height !== appContainerRef.current.clientHeight ||
      worldRef.current.screen.width !== appContainerRef.current.clientWidth
    ) {
      worldRef.current.screen.height = appContainerRef.current.clientHeight;
      worldRef.current.screen.width = appContainerRef.current.clientWidth;

      appRef.current.resize();
      renderArena(worldRef.current, renderRef.current);
    }
  }, []);

  useEffect(() => {
    syncTrackSettings(normalizeTrackDistance(distance));
  }, [distance, syncTrackSettings]);

  useEffect(() => {
    if (!worldRef.current) return;

    syncArenaHeight();
    syncPlayers(players);
  }, [players, syncArenaHeight, syncPlayers]);

  useEffect(() => {
    syncArenaHeight();
    syncPlayers(players);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.height, size.width, syncArenaHeight]);

  useEffect(() => {
    if (!appContainerRef.current) {
      return;
    }

    let destroyed = false;

    const setupApp = async () => {
      const app = new Application();

      await app.init({
        antialias: true,
        autoDensity: true,
        backgroundColor: "#000000",
        resizeTo: appContainerRef.current!,
      });

      if (destroyed) {
        app.destroy(true);
        return;
      }

      appContainerRef.current?.appendChild(app.canvas);
      appRef.current = app;

      const world = createWorld({
        players: players,
        distance: normalizeTrackDistance(distance),
        speedMin: speed[0],
        speedMax: speed[1],
        screen: { width: app.screen.width, height: app.screen.height },
        onGameStateChange: (gameState) => {
          setGameState(gameState);
        },
        onWinnerChange: (winner) => {
          setWinner(winner);
        },
      });

      worldRef.current = world;

      renderRef.current = await createRender({ app, world });

      // Apply latest distance in case it changed before world was ready
      syncTrackSettings(normalizeTrackDistance(distanceRef.current));

      app.ticker.add((tick) => {
        gameLoop({ world, render: renderRef.current!, tick });
      });
    };

    if (!worldRef.current) {
      setupApp();
    }

    return () => {
      destroyed = true;
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={appContainerRef}
      className="relative w-full max-h-[80vh]"
      style={{
        minHeight: `${HORSE_HEIGHT * 6}px`,
        height: `${HORSE_HEIGHT * (players.length || 2)}px`,
      }}
    ></div>
  );
}

function normalizeTrackDistance(trackDistance: number) {
  return trackDistance * 30;
}
