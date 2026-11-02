import { Text } from 'pixi.js';
import { COLORS, FONT_FAMILY } from './theme';

/** Повышенное разрешение, чтобы текст был чётким при масштабировании сцены. */
const TEXT_RESOLUTION = 3;

export function createLabel(
  text: string,
  fontSize: number,
  options: { color?: number; bold?: boolean; wrapWidth?: number } = {},
): Text {
  const label = new Text({
    text,
    resolution: TEXT_RESOLUTION,
    style: {
      fontFamily: FONT_FAMILY,
      fontSize,
      fontWeight: options.bold ? '700' : '400',
      fill: options.color ?? COLORS.text,
      align: 'center',
      wordWrap: options.wrapWidth !== undefined,
      wordWrapWidth: options.wrapWidth ?? 0,
    },
  });
  label.anchor.set(0.5);
  return label;
}
