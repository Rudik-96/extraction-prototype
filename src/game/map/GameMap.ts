export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GameMap {
  width: number;
  height: number;
  heroSpawn: { x: number; y: number };
  walls: readonly Rect[];
}
