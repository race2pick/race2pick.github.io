/** Kecepatan dan akselerasi */
export interface Velocity {
  current: number;
  target: number;
  elapsed: number; // accumulator untuk random speed change (ms)
}
