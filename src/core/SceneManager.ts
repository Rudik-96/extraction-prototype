import type { Container } from 'pixi.js';
import type { GoToArgs, SceneFactories, SceneId, SceneParams } from '../scenes/types';
import type { Scene } from './Scene';
import type { ScreenSize } from './Viewport';

export class SceneManager {
  private current: Scene | null = null;
  private pending: (() => Scene) | null = null;
  private readonly factories: SceneFactories;

  constructor(
    private readonly layer: Container,
    createFactories: (goTo: SceneManager['goTo']) => SceneFactories,
    private screen: ScreenSize,
  ) {
    this.factories = createFactories(this.goTo);
  }

  /**
   * Переход применяется в начале следующего кадра: кнопка, нажатая прямо сейчас,
   * не должна уничтожить сцену посреди обработки своего же события.
   */
  readonly goTo = <K extends SceneId>(id: K, ...args: GoToArgs<K>): void => {
    const params = args[0] as SceneParams[K];
    this.pending = () => this.factories[id](params);
  };

  /** Сразу применяет отложенный переход, если он есть. */
  applyPending(): void {
    if (!this.pending) return;
    const create = this.pending;
    this.pending = null;

    if (this.current) {
      this.layer.removeChild(this.current.view);
      this.current.destroy();
    }
    this.current = create();
    this.current.resize(this.screen);
    this.layer.addChild(this.current.view);
  }

  resize(screen: ScreenSize): void {
    this.screen = screen;
    this.current?.resize(screen);
  }

  fixedUpdate(dt: number): void {
    this.current?.fixedUpdate(dt);
  }

  render(alpha: number): void {
    this.current?.render(alpha);
  }
}
