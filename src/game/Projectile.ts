import { BALANCE } from '../config/balance';
import type { Poolable } from './Pool';

export class Projectile implements Poolable {
  active = false;
  readonly radius = BALANCE.bow.projectileRadius;
  x = 0;
  y = 0;
  prevX = 0;
  prevY = 0;
  angle = 0;
  damage = 0;
  private velocityX = 0;
  private velocityY = 0;
  private remainingDistance = 0;

  launch(x: number, y: number, directionX: number, directionY: number): void {
    this.x = this.prevX = x;
    this.y = this.prevY = y;
    this.angle = Math.atan2(directionY, directionX);
    this.velocityX = directionX * BALANCE.bow.projectileSpeed;
    this.velocityY = directionY * BALANCE.bow.projectileSpeed;
    this.damage = BALANCE.bow.damage;
    this.remainingDistance = BALANCE.bow.projectileFlightRange;
  }

  /** Возвращает false, когда дальность полёта исчерпана. */
  update(dt: number): boolean {
    this.prevX = this.x;
    this.prevY = this.y;
    this.x += this.velocityX * dt;
    this.y += this.velocityY * dt;
    this.remainingDistance -= BALANCE.bow.projectileSpeed * dt;
    return this.remainingDistance > 0;
  }
}
