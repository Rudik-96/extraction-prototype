import { BALANCE } from '../config/balance';
import type { Enemy } from './Enemy';
import type { FlowField } from './FlowField';
import type { Hero } from './Hero';
import type { GameMap } from './map/GameMap';
import type { Pool } from './Pool';

/** Сколько случайных точек пробовать за шаг, прежде чем отложить появление. */
const SPAWN_ATTEMPTS = 12;

const { waves } = BALANCE;

/** Запускает волны и выпускает врагов по одному за пределами экрана. */
export class WaveSpawner {
  waveNumber = 0;
  private nextWaveIn: number = waves.firstDelay;
  private nextSpawnIn = 0;
  private pending = 0;

  update(dt: number, hero: Hero, enemies: Pool<Enemy>, field: FlowField, map: GameMap): void {
    this.nextWaveIn -= dt;
    if (this.nextWaveIn <= 0) {
      this.nextWaveIn += waves.interval;
      this.pending += waves.baseCount + waves.countPerWave * this.waveNumber;
      this.waveNumber += 1;
    }

    this.nextSpawnIn = Math.max(0, this.nextSpawnIn - dt);
    if (this.pending === 0 || this.nextSpawnIn > 0 || enemies.activeCount >= waves.maxAlive) return;
    if (this.trySpawn(hero, enemies, field, map)) {
      this.pending -= 1;
      this.nextSpawnIn = waves.spawnInterval;
    }
  }

  private trySpawn(hero: Hero, enemies: Pool<Enemy>, field: FlowField, map: GameMap): boolean {
    const margin = BALANCE.enemy.radius;
    for (let attempt = 0; attempt < SPAWN_ATTEMPTS; attempt++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = waves.spawnMinDistance + Math.random() * (waves.spawnMaxDistance - waves.spawnMinDistance);
      const x = hero.x + Math.cos(angle) * distance;
      const y = hero.y + Math.sin(angle) * distance;
      if (x < margin || y < margin || x > map.width - margin || y > map.height - margin) continue;
      if (!field.isReachable(x, y)) continue;
      enemies.acquire().spawn(x, y);
      return true;
    }
    return false;
  }
}
