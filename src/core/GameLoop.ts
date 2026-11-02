/** Цикл с фиксированным шагом: логика идёт с одной скоростью при любом FPS. */
export class GameLoop {
  private accumulator = 0;

  constructor(
    private readonly step: number,
    private readonly maxFrameTime: number,
    private readonly onFixedUpdate: (dt: number) => void,
    private readonly onRender: (alpha: number) => void,
  ) {}

  /** Вызывается раз в кадр. alpha в onRender — доля шага для интерполяции отрисовки. */
  advance(frameTime: number): void {
    this.accumulator += Math.min(frameTime, this.maxFrameTime);
    while (this.accumulator >= this.step) {
      this.onFixedUpdate(this.step);
      this.accumulator -= this.step;
    }
    this.onRender(this.accumulator / this.step);
  }
}
