import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import type { Data } from "./type";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs));

const cleanNames = (names: string[]) =>
  names.filter((name) => !!name).map((name) => name.trim());

const compressData = ({ players, distance, speed }: Data) => {
  const player = players.join("|");

  const data = `${player};${distance};${speed[0]}|${speed[1]}`;

  return compressToEncodedURIComponent(data);
};

const decompressData = (data?: string | null): Data | undefined => {
  if (!data) return undefined;

  const decompressed = decompressFromEncodedURIComponent(data);

  const [player, distance, speed] = decompressed.split(";");
  const players = player.split("|");
  const [speed1, speed2] = speed.split("|");

  return {
    players,
    distance: Number(distance),
    speed: [Number(speed1), Number(speed2)],
  };
};

export { cn, cleanNames, compressData, decompressData };
