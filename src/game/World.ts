import { BALANCE } from '../config/balance';
import { Bow } from './Bow';
import { isPointInWall, resolveMapCollisions } from './collision';
import { Enemy } from './Enemy';
import { FlowField } from './FlowField';
import { Hero } from './Hero';
import type { GameMap } from './map/GameMap';
import type { MoveInput } from './MoveInput';
import { Pool } from './Pool';
import { Projectile } from './Projectile';
import { separateEnemies } from './separateEnemies';
import { WaveSpawner } from './WaveSpawner';

/** Всё состояние забега. Работает без Pixi. */
export class World {
  readonly hero: Hero;
  readonly enemies = new Pool(() => new Enemy(), BALANCE.waves.maxAlive);
  readonly projectiles = new Pool(() => new Projectile(), BALANCE.projectilePoolSize);
  readonly spawner = new WaveSpawner();
  private readonly bow = new Bow();
  private readonly flowField: FlowField;

  constructor(readonly map: GameMap) {
    this.hero = new Hero(map.heroSpawn.x, map.heroSpawn.y);
    this.flowField = new FlowField(map, BALANCE.pathfinding.cellSize, BALANCE.enemy.radius);
    this.flowField.setTarget(this.hero.x, this.hero.y);
  }

  update(dt: number, input: MoveInput): void {
    const { hero, map, enemies, projectiles, flowField } = this;

    hero.update(dt, input, map);
    flowField.setTarget(hero.x, hero.y);
    this.spawner.update(dt, hero, enemies, flowField, map);

    for (const enemy of enemies.items) {
      if (enemy.active) enemy.update(dt, hero, flowField, map);
    }
    separateEnemies(enemies.items);
    for (const enemy of enemies.items) {
      if (enemy.active) resolveMapCollisions(enemy, map);
    }

    this.bow.update(dt, hero, enemies, projectiles, map);
    this.updateProjectiles(dt);
  }

  private updateProjectiles(dt: number): void {
    const { projectiles, map } = this;
    for (const projectile of projectiles.items) {
      if (!projectile.active) continue;
      const stillFlying = projectile.update(dt);
      if (!stillFlying || isPointInWall(projectile.x, projectile.y, map) || this.hitEnemy(projectile)) {
        projectiles.release(projectile);
      }
    }
  }

  /** Наносит урон первому задетому врагу; возвращает true, если попали. */
  private hitEnemy(projectile: Projectile): boolean {
    const { enemies } = this;
    for (const enemy of enemies.items) {
      if (!enemy.active) continue;
      const dx = enemy.x - projectile.x;
      const dy = enemy.y - projectile.y;
      const reach = enemy.radius + projectile.radius;
      if (dx * dx + dy * dy >= reach * reach) continue;

      enemy.takeDamage(projectile.damage);
      if (enemy.health <= 0) enemies.release(enemy);
      return true;
    }
    return false;
  }
}
