import { Application, Container } from 'pixi.js';
import { DISPLAY, LOOP } from '../config/display';
import { DebugOverlay } from '../debug/DebugOverlay';
import { DebugState } from '../debug/DebugState';
import { LocalStorageProgressStorage } from '../save/LocalStorageProgressStorage';
import { Progress } from '../save/Progress';
import { createSceneFactories } from '../scenes/createSceneFactories';
import { GameLoop } from './GameLoop';
import { SceneManager } from './SceneManager';
import { measureViewport } from './Viewport';

/** Собирает приложение: canvas, ресайз, игровой цикл и сцены. */
export class Game {
  private readonly app = new Application();
  /** Масштабирует логические единицы в пиксели; в нём лежат сцены и отладочная панель. */
  private readonly root = new Container();
  private readonly sceneLayer = new Container();

  async start(root: HTMLElement): Promise<void> {
    const progress = await Progress.load(new LocalStorageProgressStorage());
    const initial = measureViewport(root.clientWidth, root.clientHeight);

    await this.app.init({
      width: initial.cssWidth,
      height: initial.cssHeight,
      background: DISPLAY.backgroundColor,
      resolution: Math.min(window.devicePixelRatio || 1, DISPLAY.maxResolution),
      autoDensity: true,
      antialias: false,
      preference: 'webgl',
      powerPreference: 'high-performance',
    });
    root.appendChild(this.app.canvas);

    this.root.scale.set(initial.scale);
    this.root.addChild(this.sceneLayer);
    this.app.stage.addChild(this.root);
    const debug = new DebugState();

    const scenes = new SceneManager(
      this.sceneLayer,
      (goTo) => createSceneFactories(goTo, progress, debug),
      initial.screen,
    );
    scenes.goTo('menu');

    // Отладка есть только в режиме разработки; из сборки она вырезается целиком.
    let overlay: DebugOverlay | null = null;
    if (import.meta.env.DEV) {
      overlay = new DebugOverlay(debug, progress, this.app.stage);
      overlay.resize(initial.screen);
      this.root.addChild(overlay);
    }

    const loop = new GameLoop(
      LOOP.fixedStep,
      LOOP.maxFrameTime,
      (dt) => scenes.fixedUpdate(dt),
      (alpha) => scenes.render(alpha),
    );
    this.app.ticker.add((ticker) => {
      scenes.applyPending();
      const frameTime = ticker.elapsedMS / 1000;
      loop.advance(frameTime);
      overlay?.update(frameTime);
    });

    new ResizeObserver(() => {
      const next = measureViewport(root.clientWidth, root.clientHeight);
      this.app.renderer.resize(next.cssWidth, next.cssHeight);
      this.root.scale.set(next.scale);
      scenes.resize(next.screen);
      overlay?.resize(next.screen);
      // Изменение размера очищает canvas: рисуем сразу, чтобы не мигало.
      this.app.render();
    }).observe(root);
  }
}
