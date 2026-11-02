import type { Container } from 'pixi.js';
import type { ScreenSize } from '../core/Viewport';

/** Держит цель в центре экрана, но не показывает пустоту за краем карты. */
export class Camera {
  private screen: ScreenSize = { width: 0, height: 0 };

  constructor(
    private readonly layer: Container,
    private readonly worldWidth: number,
    private readonly worldHeight: number,
  ) {}

  resize(screen: ScreenSize): void {
    this.screen = screen;
  }

  follow(x: number, y: number): void {
    this.layer.position.set(
      offsetFor(x, this.screen.width, this.worldWidth),
      offsetFor(y, this.screen.height, this.worldHeight),
    );
  }
}

function offsetFor(target: number, screenSize: number, worldSize: number): number {
  if (worldSize <= screenSize) return (screenSize - worldSize) / 2;
  return Math.min(0, Math.max(screenSize - worldSize, screenSize / 2 - target));
}
