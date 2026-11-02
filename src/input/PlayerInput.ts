import type { MoveInput } from '../game/MoveInput';
import { KeyboardInput } from './KeyboardInput';
import type { VirtualJoystick } from './VirtualJoystick';

/** Объединяет способы управления: нажатый джойстик важнее клавиатуры. */
export class PlayerInput implements MoveInput {
  x = 0;
  y = 0;
  private readonly keyboard = new KeyboardInput();

  constructor(private readonly joystick: VirtualJoystick) {}

  read(): void {
    this.keyboard.read();
    const source: MoveInput = this.joystick.active ? this.joystick : this.keyboard;
    this.x = source.x;
    this.y = source.y;
  }

  dispose(): void {
    this.keyboard.dispose();
  }
}
