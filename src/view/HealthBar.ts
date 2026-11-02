import { Container, Graphics } from 'pixi.js';
import { WORLD_COLORS } from './palette';

const HEIGHT = 5;
const BORDER = 1;

/** Полоска здоровья; центр — посередине. */
export class HealthBar extends Container {
  private readonly fill: Graphics;

  constructor(width: number, color: number) {
    super();
    const back = new Graphics()
      .rect(-width / 2 - BORDER, -HEIGHT / 2 - BORDER, width + BORDER * 2, HEIGHT + BORDER * 2)
      .fill(WORLD_COLORS.healthBarBack);
    this.fill = new Graphics().rect(0, -HEIGHT / 2, width, HEIGHT).fill(color);
    this.fill.x = -width / 2;
    this.addChild(back, this.fill);
  }

  setRatio(ratio: number): void {
    this.fill.scale.x = Math.max(0, ratio);
  }
}
