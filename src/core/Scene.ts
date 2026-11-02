import type { Container } from 'pixi.js';
import type { ScreenSize } from './Viewport';

export interface Scene {
  readonly view: Container;
  /** Вызывается сразу после создания сцены и при каждом изменении экрана. */
  resize(screen: ScreenSize): void;
  /** Шаг логики с постоянным dt в секундах. */
  fixedUpdate(dt: number): void;
  /** Отрисовка; alpha (0..1) — положение между двумя шагами логики. */
  render(alpha: number): void;
  destroy(): void;
}
