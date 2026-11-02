import { BALANCE } from '../config/balance';
import { hasLineOfSight } from './collision';
import type { Enemy } from './Enemy';
import type { Hero } from './Hero';
import type { GameMap } from './map/GameMap';
import type { Pool } from './Pool';
import type { Projectile } from './Projectile';

/** Автоматическая стрельба в ближайшего видимого врага в радиусе. */
export class Bow {
  private cooldown = 0;

  update(dt: number, hero: Hero, enemies: Pool<Enemy>, projectiles: Pool<Projectile>, map: GameMap): void {
    this.cooldown = Math.max(0, this.cooldown - dt);
    if (this.cooldown > 0) return;

    const target = findTarget(hero, enemies, map);
    if (!target) return;

    const dx = target.x - hero.x;
    const dy = target.y - hero.y;
    const distance = Math.hypot(dx, dy) || 1;
    projectiles.acquire().launch(hero.x, hero.y, dx / distance, dy / distance);
    this.cooldown = BALANCE.bow.fireInterval;
  }
}

function findTarget(hero: Hero, enemies: Pool<Enemy>, map: GameMap): Enemy | null {
  let nearest: Enemy | null = null;
  let nearestSquared: number = BALANCE.bow.range * BALANCE.bow.range;
  for (const enemy of enemies.items) {
    if (!enemy.active) continue;
    const dx = enemy.x - hero.x;
    const dy = enemy.y - hero.y;
    const distanceSquared = dx * dx + dy * dy;
    if (distanceSquared >= nearestSquared) continue;
    if (!hasLineOfSight(hero.x, hero.y, enemy.x, enemy.y, map)) continue;
    nearest = enemy;
    nearestSquared = distanceSquared;
  }
  return nearest;
}
