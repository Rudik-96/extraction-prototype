import { ScreenScene } from './ScreenScene';
import type { GoTo } from './types';

/** Заглушка забега: счётчик показывает, что логика идёт с постоянной скоростью. */
export class RunScene extends ScreenScene {
  private steps = 0;
  private elapsed = 0;

  constructor(goTo: GoTo) {
    super('Забег', '', [
      { label: 'Выбрался (тест)', primary: true, onTap: () => goTo('result', { outcome: 'extracted', lootValue: 100 }) },
      { label: 'Погиб (тест)', onTap: () => goTo('result', { outcome: 'died', lootValue: 100 }) },
      { label: 'Время вышло (тест)', onTap: () => goTo('result', { outcome: 'timeout', lootValue: 100 }) },
    ]);
    this.showElapsed();
  }

  override fixedUpdate(dt: number): void {
    const previousSecond = Math.floor(this.elapsed);
    this.steps += 1;
    this.elapsed += dt;
    // Обновляем текст раз в секунду: перерисовка Text дорогая.
    if (Math.floor(this.elapsed) !== previousSecond) this.showElapsed();
  }

  private showElapsed(): void {
    this.subtitle.text = `Время логики: ${Math.floor(this.elapsed)} с, шагов: ${this.steps}`;
  }
}
