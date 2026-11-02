import { Graphics } from 'pixi.js';
import type { ExitZone } from '../game/ExitZone';
import { WORLD_COLORS } from './palette';

/** На каком расстоянии от центра героя висит стрелка. */
const ORBIT = 46;

/** Стрелка рядом с героем: показывает направление на выход. */
export class ExitPointerView extends Graphics {
  constructor(private readonly exit: ExitZone) {
    super();
    this.poly([9, 0, -6, -7, -6, 7]).fill(WORLD_COLORS.exit);
  }

  render(heroX: number, heroY: number): void {
    this.visible = !this.exit.heroInside;
    if (!this.visible) return;
    const angle = Math.atan2(this.exit.y - heroY, this.exit.x - heroX);
    this.position.set(heroX + Math.cos(angle) * ORBIT, heroY + Math.sin(angle) * ORBIT);
    this.rotation = angle;
  }
}
