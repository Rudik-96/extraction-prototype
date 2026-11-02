import { Container } from 'pixi.js';
import type { ScreenSize } from '../core/Viewport';
import type { Enemy } from '../game/Enemy';
import type { Loot } from '../game/Loot';
import type { Projectile } from '../game/Projectile';
import type { World } from '../game/World';
import { Camera } from './Camera';
import { EnemyView } from './EnemyView';
import { ExitPointerView } from './ExitPointerView';
import { ExitView } from './ExitView';
import { HeroView } from './HeroView';
import { LootView } from './LootView';
import { MapView } from './MapView';
import { PooledViews } from './PooledViews';
import { ProjectileView } from './ProjectileView';

/** Рисует состояние мира; сам мир не меняет. */
export class WorldView extends Container {
  private readonly camera: Camera;
  private readonly heroView: HeroView;
  private readonly exitView: ExitView;
  private readonly exitPointer: ExitPointerView;
  private readonly lootViews: PooledViews<Loot, LootView>;
  private readonly enemyViews: PooledViews<Enemy, EnemyView>;
  private readonly projectileViews: PooledViews<Projectile, ProjectileView>;

  constructor(world: World) {
    super();
    this.heroView = new HeroView(world.hero);
    this.exitView = new ExitView(world.exit);
    this.exitPointer = new ExitPointerView(world.exit);
    this.lootViews = new PooledViews(world.loot, (loot) => new LootView(loot));
    this.enemyViews = new PooledViews(world.enemies, (enemy) => new EnemyView(enemy));
    this.projectileViews = new PooledViews(world.projectiles, (projectile) => new ProjectileView(projectile));
    this.addChild(
      new MapView(world.map),
      this.exitView,
      this.lootViews,
      this.enemyViews,
      this.heroView,
      this.projectileViews,
      this.exitPointer,
    );
    this.camera = new Camera(this, world.map.width, world.map.height);
  }

  resize(screen: ScreenSize): void {
    this.camera.resize(screen);
  }

  render(alpha: number): void {
    this.exitView.render();
    this.lootViews.render(alpha);
    this.enemyViews.render(alpha);
    this.projectileViews.render(alpha);
    this.heroView.render(alpha);
    this.exitPointer.render(this.heroView.x, this.heroView.y);
    this.camera.follow(this.heroView.x, this.heroView.y);
  }
}
