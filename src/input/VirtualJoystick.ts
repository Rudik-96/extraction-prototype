import { JOYSTICK } from '../config/display';
import type { MoveInput } from '../game/MoveInput';

/** Логика плавающего джойстика: центр там, куда поставили палец. */
export class VirtualJoystick implements MoveInput {
  x = 0;
  y = 0;
  originX = 0;
  originY = 0;
  /** Смещение ручки от центра, в единицах экрана. */
  knobX = 0;
  knobY = 0;
  private pointerId: number | null = null;

  get active(): boolean {
    return this.pointerId !== null;
  }

  press(pointerId: number, x: number, y: number): void {
    if (this.active) return;
    this.pointerId = pointerId;
    this.originX = x;
    this.originY = y;
    this.setKnob(0, 0);
  }

  move(pointerId: number, x: number, y: number): void {
    if (pointerId !== this.pointerId) return;
    this.setKnob(x - this.originX, y - this.originY);
  }

  release(pointerId: number): void {
    if (pointerId === this.pointerId) this.reset();
  }

  reset(): void {
    this.pointerId = null;
    this.setKnob(0, 0);
  }

  private setKnob(dx: number, dy: number): void {
    const distance = Math.hypot(dx, dy);
    const clamped = Math.min(distance, JOYSTICK.radius);
    const unitX = distance > 0 ? dx / distance : 0;
    const unitY = distance > 0 ? dy / distance : 0;
    this.knobX = unitX * clamped;
    this.knobY = unitY * clamped;

    // Величина растёт от края мёртвой зоны до 1, так что возможен медленный шаг.
    const magnitude = clamped / JOYSTICK.radius;
    const strength = magnitude <= JOYSTICK.deadZone ? 0 : (magnitude - JOYSTICK.deadZone) / (1 - JOYSTICK.deadZone);
    this.x = unitX * strength;
    this.y = unitY * strength;
  }
}
