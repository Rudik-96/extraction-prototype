import type { Enemy } from './Enemy';

/** Доля перекрытия, убираемая за шаг: толпа расходится мягко, без дрожания. */
const PUSH_STRENGTH = 0.5;

/** Расталкивает врагов, чтобы они не собирались в одну точку. */
export function separateEnemies(enemies: readonly Enemy[]): void {
  for (let i = 0; i < enemies.length; i++) {
    const a = enemies[i];
    if (!a.active) continue;
    for (let j = i + 1; j < enemies.length; j++) {
      const b = enemies[j];
      if (!b.active) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const minDistance = a.radius + b.radius;
      const distanceSquared = dx * dx + dy * dy;
      if (distanceSquared >= minDistance * minDistance || distanceSquared === 0) continue;

      const distance = Math.sqrt(distanceSquared);
      const push = ((minDistance - distance) * PUSH_STRENGTH * 0.5) / distance;
      a.x -= dx * push;
      a.y -= dy * push;
      b.x += dx * push;
      b.y += dy * push;
    }
  }
}
