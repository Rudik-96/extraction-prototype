import { BALANCE } from '../config/balance';
import type { Hero } from './Hero';
import type { Point } from './map/GameMap';

/** Точка выхода: герой должен простоять в ней нужное время без перерыва. */
export class ExitZone {
  readonly x: number;
  readonly y: number;
  readonly radius = BALANCE.run.exitRadius;
  heroInside = false;
  private holdTime = 0;

  constructor(position: Point) {
    this.x = position.x;
    this.y = position.y;
  }

  /** Заполнение от 0 до 1. */
  get progress(): number {
    return Math.min(1, this.holdTime / BALANCE.run.exitHoldTime);
  }

  update(dt: number, hero: Hero): void {
    const dx = hero.x - this.x;
    const dy = hero.y - this.y;
    this.heroInside = dx * dx + dy * dy <= this.radius * this.radius;
    this.holdTime = this.heroInside ? this.holdTime + dt : 0;
  }
}
