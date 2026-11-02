import type { MoveInput } from '../game/MoveInput';

const LEFT = ['KeyA', 'ArrowLeft'];
const RIGHT = ['KeyD', 'ArrowRight'];
const UP = ['KeyW', 'ArrowUp'];
const DOWN = ['KeyS', 'ArrowDown'];
const HANDLED = new Set([...LEFT, ...RIGHT, ...UP, ...DOWN]);

/** WASD и стрелки. Коды клавиш не зависят от раскладки, поэтому работает и на русской. */
export class KeyboardInput implements MoveInput {
  x = 0;
  y = 0;
  private readonly pressed = new Set<string>();

  constructor() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
  }

  /** Пересчитывает направление; вызывается перед чтением x и y. */
  read(): void {
    const x = this.axis(LEFT, RIGHT);
    const y = this.axis(UP, DOWN);
    const scale = x !== 0 && y !== 0 ? Math.SQRT1_2 : 1;
    this.x = x * scale;
    this.y = y * scale;
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
  }

  private axis(negative: string[], positive: string[]): number {
    const isPressed = (code: string) => this.pressed.has(code);
    return (positive.some(isPressed) ? 1 : 0) - (negative.some(isPressed) ? 1 : 0);
  }

  private readonly onKeyDown = (event: KeyboardEvent): void => {
    if (!HANDLED.has(event.code)) return;
    event.preventDefault();
    this.pressed.add(event.code);
  };

  private readonly onKeyUp = (event: KeyboardEvent): void => {
    this.pressed.delete(event.code);
  };

  private readonly onBlur = (): void => {
    this.pressed.clear();
  };
}
