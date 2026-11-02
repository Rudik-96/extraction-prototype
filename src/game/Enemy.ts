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
  /** Спящий охранник стоит на месте, пока не заметит героя или не получит стрелу. */
  dormant = false;
  private contactCooldown = 0;

  spawn(x: number, y: number, dormant = false): void {
    this.dormant = dormant;
    this.x = this.prevX = x;
    this.y = this.prevY = y;
    this.health = this.maxHealth;
    this.contactCooldown = 0;
  }

  takeDamage(amount: number): void {
    this.health -= amount;
    this.dormant = false;
  }

  /** Двигается к герою и бьёт при касании. Со стенами разбирается World. */
  update(dt: number, hero: Hero, field: FlowField, map: GameMap): void {
    this.prevX = this.x;
    this.prevY = this.y;
    this.contactCooldown = Math.max(0, this.contactCooldown - dt);

    if (this.dormant) {
      this.dormant = !this.noticesHero(hero, map);
      return;
    }

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

  private noticesHero(hero: Hero, map: GameMap): boolean {
    const dx = hero.x - this.x;
    const dy = hero.y - this.y;
    const aggro = BALANCE.enemy.guardAggroRadius;
    return dx * dx + dy * dy <= aggro * aggro && hasLineOfSight(this.x, this.y, hero.x, hero.y, map);
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
