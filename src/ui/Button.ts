import { Container, Graphics, Rectangle, type Text } from 'pixi.js';
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
const DISABLED_ALPHA = 0.4;

/** Простая кнопка; точка отсчёта — её центр. */
export class Button extends Container {
  private readonly labelText: Text;

  constructor({ label, onTap, primary = false, width = 260, height = 56 }: ButtonOptions) {
    super();

    const background = new Graphics()
      .roundRect(-width / 2, -height / 2, width, height, 12)
      .fill(primary ? COLORS.accent : COLORS.button)
      .stroke({ width: 2, color: primary ? COLORS.accentBorder : COLORS.buttonBorder });
    this.labelText = createLabel(label, 20, { bold: true });
    this.addChild(background, this.labelText);

    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.hitArea = new Rectangle(-width / 2, -height / 2, width, height);

    const release = () => (this.alpha = this.eventMode === 'none' ? DISABLED_ALPHA : 1);
    this.on('pointerdown', () => (this.alpha = PRESSED_ALPHA));
    this.on('pointerup', release);
    this.on('pointerupoutside', release);
    this.on('pointertap', onTap);
  }

  setLabel(text: string): void {
    if (this.labelText.text !== text) this.labelText.text = text;
  }

  setEnabled(enabled: boolean): void {
    this.eventMode = enabled ? 'static' : 'none';
    this.alpha = enabled ? 1 : DISABLED_ALPHA;
  }
}
