import { Graphics, GraphicsContext } from 'pixi.js';
import type { Projectile } from '../game/Projectile';
import { WORLD_COLORS } from './palette';

const LENGTH = 18;
const THICKNESS = 3;

const arrowContext = new GraphicsContext()
  .rect(-LENGTH / 2, -THICKNESS / 2, LENGTH, THICKNESS)
  .fill(WORLD_COLORS.projectile);

export class ProjectileView extends Graphics {
  constructor(private readonly projectile: Projectile) {
    super(arrowContext);
  }

  render(alpha: number): void {
    const { projectile } = this;
    this.position.set(
      projectile.prevX + (projectile.x - projectile.prevX) * alpha,
      projectile.prevY + (projectile.y - projectile.prevY) * alpha,
    );
    this.rotation = projectile.angle;
  }
}
