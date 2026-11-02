import { BALANCE } from '../config/balance';
import type { LootTier } from './map/GameMap';
import type { Poolable } from './Pool';

export class Loot implements Poolable {
  active = false;
  x = 0;
  y = 0;
  tier: LootTier = 'small';
  value = 0;
  radius = 0;

  place(x: number, y: number, tier: LootTier): void {
    const { value, radius } = BALANCE.loot.tiers[tier];
    this.x = x;
    this.y = y;
    this.tier = tier;
    this.value = value;
    this.radius = radius;
  }
}
