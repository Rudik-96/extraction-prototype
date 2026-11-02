import { Container } from 'pixi.js';
import type { ScreenSize } from '../core/Viewport';
import type { World } from '../game/World';
import { Camera } from './Camera';
import { HeroView } from './HeroView';
import { MapView } from './MapView';

/** Рисует состояние мира; сам мир не меняет. */
export class WorldView extends Container {
  private readonly camera: Camera;
  private readonly heroView: HeroView;

  constructor(world: World) {
    super();
    this.heroView = new HeroView(world.hero);
    this.addChild(new MapView(world.map), this.heroView);
    this.camera = new Camera(this, world.map.width, world.map.height);
  }

  resize(screen: ScreenSize): void {
    this.camera.resize(screen);
  }

  render(alpha: number): void {
    this.heroView.render(alpha);
    this.camera.follow(this.heroView.x, this.heroView.y);
  }
}
