import { Container, Graphics, Rectangle } from 'pixi.js';
import { createLabel } from './createLabel';
import { COLORS } from './theme';

export interface ButtonOptions {
  label: string;
  onTap: () => void;
  primary?: boolean;
  width?: number;
  height?: number;
}

const PRESSED_ALPHA = 0.65;

/** Простая кнопка; точка отсчёта — её центр. */
export class Button extends Container {
  constructor({ label, onTap, primary = false, width = 260, height = 56 }: ButtonOptions) {
    super();

    const background = new Graphics()
      .roundRect(-width / 2, -height / 2, width, height, 12)
      .fill(primary ? COLORS.accent : COLORS.button)
      .stroke({ width: 2, color: primary ? COLORS.accentBorder : COLORS.buttonBorder });
    this.addChild(background, createLabel(label, 20, { bold: true }));

    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.hitArea = new Rectangle(-width / 2, -height / 2, width, height);

    const release = () => (this.alpha = 1);
    this.on('pointerdown', () => (this.alpha = PRESSED_ALPHA));
    this.on('pointerup', release);
    this.on('pointerupoutside', release);
    this.on('pointertap', onTap);
  }
}
