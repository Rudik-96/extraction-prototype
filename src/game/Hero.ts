import { BALANCE } from '../config/balance';
import { resolveMapCollisions, type CircleBody } from './collision';
import type { GameMap } from './map/GameMap';
import type { MoveInput } from './MoveInput';

/** Данные и логика героя; про отрисовку ничего не знает. */
export class Hero implements CircleBody {
  readonly radius = BALANCE.hero.radius;
  x: number;
  y: number;
  /** Положение на прошлом шаге, для плавной отрисовки между шагами. */
  prevX: number;
  prevY: number;
  /** Куда смотрит герой, радианы. */
  facing = -Math.PI / 2;
  readonly maxHealth = BALANCE.hero.maxHealth;
  health: number = BALANCE.hero.maxHealth;

  constructor(x: number, y: number) {
    this.x = this.prevX = x;
    this.y = this.prevY = y;
  }

  get isDead(): boolean {
    return this.health <= 0;
  }

  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }

  update(dt: number, input: MoveInput, map: GameMap): void {
    this.prevX = this.x;
    this.prevY = this.y;
    if (input.x === 0 && input.y === 0) return;

    this.facing = Math.atan2(input.y, input.x);
    this.x += input.x * BALANCE.hero.speed * dt;
    this.y += input.y * BALANCE.hero.speed * dt;
    resolveMapCollisions(this, map);
  }
}
