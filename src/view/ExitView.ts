import { Container, Graphics } from 'pixi.js';
import type { ExitZone } from '../game/ExitZone';
import { createLabel } from '../ui/createLabel';
import { WORLD_COLORS } from './palette';

/** Зона выхода; внутренний круг растёт, пока герой стоит внутри. */
export class ExitView extends Container {
  private readonly fill: Graphics;

  constructor(private readonly exit: ExitZone) {
    super();
    const zone = new Graphics()
      .circle(0, 0, exit.radius)
      .fill({ color: WORLD_COLORS.exit, alpha: 0.15 })
      .stroke({ width: 3, color: WORLD_COLORS.exit });
    this.fill = new Graphics().circle(0, 0, exit.radius).fill({ color: WORLD_COLORS.exit, alpha: 0.5 });
    this.position.set(exit.x, exit.y);
    this.addChild(zone, this.fill, createLabel('ВЫХОД', 16, { bold: true, color: WORLD_COLORS.exit }));
    this.render();
  }

  render(): void {
    this.fill.scale.set(this.exit.progress);
  }
}
