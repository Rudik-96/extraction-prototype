export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export type LootTier = 'small' | 'medium' | 'large';

export interface LootPlacement extends Point {
  tier: LootTier;
}

export interface GameMap {
  width: number;
  height: number;
  heroSpawn: Point;
  exit: Point;
  walls: readonly Rect[];
  loot: readonly LootPlacement[];
  /** Где стоят спящие враги-охранники. */
  guards: readonly Point[];
}
