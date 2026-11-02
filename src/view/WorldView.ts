import { Container } from 'pixi.js';
import type { ScreenSize } from '../core/Viewport';
import type { Enemy } from '../game/Enemy';
import type { Projectile } from '../game/Projectile';
import type { World } from '../game/World';
import { Camera } from './Camera';
import { EnemyView } from './EnemyView';
import { HeroView } from './HeroView';
import { MapView } from './MapView';
import { PooledViews } from './PooledViews';
import { ProjectileView } from './ProjectileView';

/** Рисует состояние мира; сам мир не меняет. */
export class WorldView extends Container {
  private readonly camera: Camera;
  private readonly heroView: HeroView;
  private readonly enemyViews: PooledViews<Enemy, EnemyView>;
  private readonly projectileViews: PooledViews<Projectile, ProjectileView>;

  constructor(world: World) {
    super();
    this.heroView = new HeroView(world.hero);
    this.enemyViews = new PooledViews(world.enemies, (enemy) => new EnemyView(enemy));
    this.projectileViews = new PooledViews(world.projectiles, (projectile) => new ProjectileView(projectile));
    this.addChild(new MapView(world.map), this.enemyViews, this.heroView, this.projectileViews);
    this.camera = new Camera(this, world.map.width, world.map.height);
  }

  resize(screen: ScreenSize): void {
    this.camera.resize(screen);
  }

  render(alpha: number): void {
    this.enemyViews.render(alpha);
    this.projectileViews.render(alpha);
    this.heroView.render(alpha);
    this.camera.follow(this.heroView.x, this.heroView.y);
  }
}
