import { DISPLAY } from '../config/display';

/** Размер экрана в логических единицах: все сцены верстаются в них. */
export interface ScreenSize {
  width: number;
  height: number;
}

export interface ViewportMetrics {
  /** Размер canvas в CSS-пикселях. */
  cssWidth: number;
  cssHeight: number;
  /** Сколько CSS-пикселей в одной логической единице. */
  scale: number;
  screen: ScreenSize;
}

/** Считает портретную область экрана для размера контейнера. */
export function measureViewport(availableWidth: number, availableHeight: number): ViewportMetrics {
  const cssHeight = Math.max(1, Math.floor(availableHeight));
  const cssWidth = Math.max(1, Math.floor(Math.min(availableWidth, cssHeight * DISPLAY.maxAspect)));
  const scale = cssWidth / DISPLAY.designWidth;
  return {
    cssWidth,
    cssHeight,
    scale,
    screen: { width: DISPLAY.designWidth, height: cssHeight / scale },
  };
}
