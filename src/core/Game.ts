import { Application, Container } from 'pixi.js';
import { DISPLAY, LOOP } from '../config/display';
import { createSceneFactories } from '../scenes/createSceneFactories';
import { GameLoop } from './GameLoop';
import { SceneManager } from './SceneManager';
import { measureViewport } from './Viewport';

/** Собирает приложение: canvas, ресайз, игровой цикл и сцены. */
export class Game {
  private readonly app = new Application();
  private readonly sceneLayer = new Container();

  async start(root: HTMLElement): Promise<void> {
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

    this.sceneLayer.scale.set(initial.scale);
    this.app.stage.addChild(this.sceneLayer);

    const scenes = new SceneManager(this.sceneLayer, createSceneFactories, initial.screen);
    scenes.goTo('menu');

    const loop = new GameLoop(
      LOOP.fixedStep,
      LOOP.maxFrameTime,
      (dt) => scenes.fixedUpdate(dt),
      (alpha) => scenes.render(alpha),
    );
    this.app.ticker.add((ticker) => {
      scenes.applyPending();
      loop.advance(ticker.elapsedMS / 1000);
    });

    new ResizeObserver(() => {
      const next = measureViewport(root.clientWidth, root.clientHeight);
      this.app.renderer.resize(next.cssWidth, next.cssHeight);
      this.sceneLayer.scale.set(next.scale);
      scenes.resize(next.screen);
      // Изменение размера очищает canvas: рисуем сразу, чтобы не мигало.
      this.app.render();
    }).observe(root);
  }
}
