import { BALANCE } from '../config/balance';

export const UPGRADE_IDS = ['damage', 'fireRate', 'range', 'health', 'moveSpeed'] as const;

export type UpgradeId = (typeof UPGRADE_IDS)[number];

export type UpgradeLevels = Record<UpgradeId, number>;

/** Итоговые характеристики героя на забег. */
export interface HeroStats {
  damage: number;
  shotsPerSecond: number;
  range: number;
  maxHealth: number;
  speed: number;
}

export function createDefaultLevels(): UpgradeLevels {
  return { damage: 0, fireRate: 0, range: 0, health: 0, moveSpeed: 0 };
}

export function computeHeroStats(levels: UpgradeLevels): HeroStats {
  const { items } = BALANCE.upgrades;
  return {
    damage: BALANCE.bow.damage + items.damage.perLevel * levels.damage,
    shotsPerSecond: BALANCE.bow.shotsPerSecond + items.fireRate.perLevel * levels.fireRate,
    range: BALANCE.bow.range + items.range.perLevel * levels.range,
    maxHealth: BALANCE.hero.maxHealth + items.health.perLevel * levels.health,
    speed: BALANCE.hero.speed + items.moveSpeed.perLevel * levels.moveSpeed,
  };
}

/** Цена следующего уровня; null, если уровень максимальный. */
export function getUpgradeCost(id: UpgradeId, level: number): number | null {
  const { maxLevel, costGrowth, items } = BALANCE.upgrades;
  if (level >= maxLevel) return null;
  return Math.round(items[id].baseCost * costGrowth ** level);
}
