import { BALANCE } from '../config/balance';
import { type CircleBody, hasLineOfSight } from './collision';
import type { FlowField, Vector } from './FlowField';
import type { Hero } from './Hero';
import type { GameMap } from './map/GameMap';
import type { Poolable } from './Pool';

/** Зазор, при котором враг уже считается коснувшимся героя. */
const CONTACT_MARGIN = 2;

const direction: Vector = { x: 0, y: 0 };

export class Enemy implements CircleBody, Poolable {
  active = false;
  readonly radius = BALANCE.enemy.radius;
  readonly maxHealth = BALANCE.enemy.maxHealth;
  x = 0;
  y = 0;
  prevX = 0;
  prevY = 0;
  health = 0;
  private contactCooldown = 0;

  spawn(x: number, y: number): void {
    this.x = this.prevX = x;
    this.y = this.prevY = y;
    this.health = this.maxHealth;
    this.contactCooldown = 0;
  }

  takeDamage(amount: number): void {
    this.health -= amount;
  }

  /** Двигается к герою и бьёт при касании. Со стенами разбирается World. */
  update(dt: number, hero: Hero, field: FlowField, map: GameMap): void {
    this.prevX = this.x;
    this.prevY = this.y;
    this.contactCooldown = Math.max(0, this.contactCooldown - dt);

    this.writeMoveDirection(hero, field, map);
    this.x += direction.x * BALANCE.enemy.speed * dt;
    this.y += direction.y * BALANCE.enemy.speed * dt;

    const dx = this.x - hero.x;
    const dy = this.y - hero.y;
    const distance = Math.hypot(dx, dy);
    const touching = this.radius + hero.radius;
    if (distance === 0) return;

    if (distance < touching) {
      this.x = hero.x + (dx / distance) * touching;
      this.y = hero.y + (dy / distance) * touching;
    }
    if (distance <= touching + CONTACT_MARGIN && this.contactCooldown === 0) {
      hero.takeDamage(BALANCE.enemy.contactDamage);
      this.contactCooldown = BALANCE.enemy.contactInterval;
    }
  }

  /** Если герой виден вблизи — прямо к нему, иначе по полю направлений. */
  private writeMoveDirection(hero: Hero, field: FlowField, map: GameMap): void {
    const dx = hero.x - this.x;
    const dy = hero.y - this.y;
    const distance = Math.hypot(dx, dy) || 1;
    const seesHero =
      distance <= BALANCE.pathfinding.directChaseDistance && hasLineOfSight(this.x, this.y, hero.x, hero.y, map);
    if (seesHero || !field.writeDirection(this.x, this.y, direction)) {
      direction.x = dx / distance;
      direction.y = dy / distance;
    }
  }
}
