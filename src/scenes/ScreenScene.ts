import { Container, type Text } from 'pixi.js';
import type { Scene } from '../core/Scene';
import type { ScreenSize } from '../core/Viewport';
import { Button, type ButtonOptions } from '../ui/Button';
import { createLabel } from '../ui/createLabel';
import { COLORS } from '../ui/theme';

const BUTTON_SPACING = 72;

/** Экран из заголовка, поясняющего текста и столбика кнопок. */
export abstract class ScreenScene implements Scene {
  readonly view = new Container();
  protected readonly subtitle: Text;
  private readonly title: Text;
  private readonly buttons: Button[];

  protected constructor(title: string, subtitle: string, buttons: ButtonOptions[]) {
    this.title = createLabel(title, 34, { bold: true });
    this.subtitle = createLabel(subtitle, 18, { color: COLORS.textMuted, wrapWidth: 330 });
    this.buttons = buttons.map((options) => new Button(options));
    this.view.addChild(this.title, this.subtitle, ...this.buttons);
  }

  resize({ width, height }: ScreenSize): void {
    const centerX = width / 2;
    this.title.position.set(centerX, height * 0.2);
    this.subtitle.position.set(centerX, height * 0.2 + 70);

    const firstY = height * 0.62 - ((this.buttons.length - 1) * BUTTON_SPACING) / 2;
    this.buttons.forEach((button, index) => {
      button.position.set(centerX, firstY + index * BUTTON_SPACING);
    });
  }

  fixedUpdate(_dt: number): void {}

  render(_alpha: number): void {}

  destroy(): void {
    this.view.destroy({ children: true });
  }
}
