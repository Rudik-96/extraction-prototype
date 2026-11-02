import { BALANCE } from '../config/balance';
import { Bow } from './Bow';
import { hasLineOfSight, isPointInWall, resolveMapCollisions } from './collision';
import { Enemy } from './Enemy';
import { ExitZone } from './ExitZone';
import { FlowField } from './FlowField';
import { Hero } from './Hero';
import { Loot } from './Loot';
import type { GameMap } from './map/GameMap';
import type { MoveInput } from './MoveInput';
import { Pool } from './Pool';
import { Projectile } from './Projectile';
import { separateEnemies } from './separateEnemies';
import { WaveSpawner } from './WaveSpawner';

export type RunOutcome = 'extracted' | 'died' | 'timeout';

/** Всё состояние забега. Работает без Pixi. */
export class World {
  readonly hero: Hero;
  readonly enemies = new Pool(() => new Enemy(), BALANCE.waves.maxAlive);
  readonly projectiles = new Pool(() => new Projectile(), BALANCE.projectilePoolSize);
  readonly loot: Pool<Loot>;
  readonly exit: ExitZone;
  readonly spawner = new WaveSpawner();
  timeLeft: number = BALANCE.run.duration;
  lootCollected = 0;
  kills = 0;
  /** Чем закончился забег; null, пока он идёт. */
  outcome: RunOutcome | null = null;
  private readonly bow = new Bow();
  private readonly flowField: FlowField;

  constructor(readonly map: GameMap) {
    this.hero = new Hero(map.heroSpawn.x, map.heroSpawn.y);
    this.exit = new ExitZone(map.exit);
    this.flowField = new FlowField(map, BALANCE.pathfinding.cellSize, BALANCE.enemy.radius);
    this.flowField.setTarget(this.hero.x, this.hero.y);

    this.loot = new Pool(() => new Loot(), map.loot.length + BALANCE.loot.extraPoolSize);
    for (const { x, y, tier } of map.loot) this.loot.acquire().place(x, y, tier);
    for (const { x, y } of map.guards) this.enemies.acquire().spawn(x, y, true);
  }

  update(dt: number, input: MoveInput): void {
    if (this.outcome) return;
    const { hero, map, enemies, projectiles, flowField } = this;

    this.timeLeft = Math.max(0, this.timeLeft - dt);
    hero.update(dt, input, map);
    flowField.setTarget(hero.x, hero.y);
    this.spawner.update(dt, hero, enemies, flowField, map);

    for (const enemy of enemies.items) {
      if (!enemy.active) continue;
      const wasDormant = enemy.dormant;
      enemy.update(dt, hero, flowField, map);
      if (wasDormant && !enemy.dormant) this.alertGuards(enemy);
    }
    separateEnemies(enemies.items);
    for (const enemy of enemies.items) {
      if (enemy.active) resolveMapCollisions(enemy, map);
    }

    this.bow.update(dt, hero, enemies, projectiles, map);
    this.updateProjectiles(dt);
    this.collectLoot();
    this.exit.update(dt, hero);
    this.updateOutcome();
  }

  private updateOutcome(): void {
    if (this.hero.isDead) this.outcome = 'died';
    else if (this.exit.progress >= 1) this.outcome = 'extracted';
    else if (this.timeLeft <= 0) this.outcome = 'timeout';
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
    for (const enemy of this.enemies.items) {
      if (!enemy.active) continue;
      const dx = enemy.x - projectile.x;
      const dy = enemy.y - projectile.y;
      const reach = enemy.radius + projectile.radius;
      if (dx * dx + dy * dy >= reach * reach) continue;

      const wasDormant = enemy.dormant;
      enemy.takeDamage(projectile.damage);
      if (wasDormant) this.alertGuards(enemy);
      if (enemy.health <= 0) this.killEnemy(enemy);
      return true;
    }
    return false;
  }

  /** Будит охрану рядом, иначе спящих можно снимать из лука по одному. */
  private alertGuards(source: Enemy): void {
    const radius = BALANCE.enemy.guardAlertRadius;
    for (const enemy of this.enemies.items) {
      if (!enemy.active || !enemy.dormant) continue;
      const dx = enemy.x - source.x;
      const dy = enemy.y - source.y;
      if (dx * dx + dy * dy > radius * radius) continue;
      if (hasLineOfSight(source.x, source.y, enemy.x, enemy.y, this.map)) enemy.dormant = false;
    }
  }

  private killEnemy(enemy: Enemy): void {
    this.kills += 1;
    this.enemies.release(enemy);
    if (Math.random() < BALANCE.enemy.lootDropChance) {
      this.loot.acquire().place(enemy.x, enemy.y, BALANCE.enemy.lootDropTier);
    }
  }

  private collectLoot(): void {
    const { hero, loot } = this;
    for (const item of loot.items) {
      if (!item.active) continue;
      const dx = item.x - hero.x;
      const dy = item.y - hero.y;
      const reach = hero.radius + item.radius + BALANCE.loot.pickupMargin;
      if (dx * dx + dy * dy > reach * reach) continue;
      this.lootCollected += item.value;
      loot.release(item);
    }
  }
}
