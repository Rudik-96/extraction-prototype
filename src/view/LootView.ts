import { Graphics, GraphicsContext } from 'pixi.js';
import type { Loot } from '../game/Loot';
import type { LootTier } from '../game/map/GameMap';
import { WORLD_COLORS } from './palette';

const TIER_COLORS: Record<LootTier, number> = {
  small: WORLD_COLORS.lootSmall,
  medium: WORLD_COLORS.lootMedium,
  large: WORLD_COLORS.lootLarge,
};

/** Единичный белый ромб: размер и цвет зависят от ценности. */
const shapeContext = new GraphicsContext().poly([0, -1, 1, 0, 0, 1, -1, 0]).fill(0xffffff);

export class LootView extends Graphics {
  constructor(private readonly loot: Loot) {
    super(shapeContext);
  }

  render(_alpha: number): void {
    const { loot } = this;
    this.position.set(loot.x, loot.y);
    this.scale.set(loot.radius);
    this.tint = TIER_COLORS[loot.tier];
  }
}
