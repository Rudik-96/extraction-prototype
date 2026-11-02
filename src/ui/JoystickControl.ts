import { Container, type DestroyOptions, type FederatedPointerEvent, Graphics, Point, Rectangle } from 'pixi.js';
import { JOYSTICK } from '../config/display';
import type { ScreenSize } from '../core/Viewport';
import { VirtualJoystick } from '../input/VirtualJoystick';
import { COLORS } from './theme';

const IDLE_ALPHA = 0.35;
const ACTIVE_ALPHA = 0.8;

/** Вид джойстика и зона касания на весь экран, передающая события в логику. */
export class JoystickControl extends Container {
  readonly joystick = new VirtualJoystick();
  private readonly zone = new Rectangle();
  private readonly base = new Graphics()
    .circle(0, 0, JOYSTICK.radius)
    .fill({ color: COLORS.text, alpha: 0.15 })
    .stroke({ width: 2, color: COLORS.text });
  private readonly knob = new Graphics().circle(0, 0, JOYSTICK.knobRadius).fill(COLORS.text);
  private readonly localPoint = new Point();
  private restX = 0;
  private restY = 0;

  constructor() {
    super();
    this.addChild(this.base, this.knob);
    this.eventMode = 'static';
    this.hitArea = this.zone;

    this.on('pointerdown', this.onPointerDown);
    this.on('globalpointermove', this.onPointerMove);
    this.on('pointerup', this.onPointerUp);
    this.on('pointerupoutside', this.onPointerUp);
    window.addEventListener('pointercancel', this.onCancel);
    window.addEventListener('blur', this.onCancel);
    this.sync();
  }

  resize({ width, height }: ScreenSize): void {
    this.zone.width = width;
    this.zone.height = height;
    this.restX = width / 2;
    this.restY = height - JOYSTICK.restBottomOffset;
    this.sync();
  }

  override destroy(options?: DestroyOptions): void {
    window.removeEventListener('pointercancel', this.onCancel);
    window.removeEventListener('blur', this.onCancel);
    super.destroy(options);
  }

  private sync(): void {
    const { joystick } = this;
    const x = joystick.active ? joystick.originX : this.restX;
    const y = joystick.active ? joystick.originY : this.restY;
    this.base.position.set(x, y);
    this.knob.position.set(x + joystick.knobX, y + joystick.knobY);
    const alpha = joystick.active ? ACTIVE_ALPHA : IDLE_ALPHA;
    this.base.alpha = alpha;
    this.knob.alpha = alpha;
  }

  private readonly onPointerDown = (event: FederatedPointerEvent): void => {
    const point = event.getLocalPosition(this, this.localPoint);
    this.joystick.press(event.pointerId, point.x, point.y);
    this.sync();
  };

  private readonly onPointerMove = (event: FederatedPointerEvent): void => {
    if (!this.joystick.active) return;
    const point = event.getLocalPosition(this, this.localPoint);
    this.joystick.move(event.pointerId, point.x, point.y);
    this.sync();
  };

  private readonly onPointerUp = (event: FederatedPointerEvent): void => {
    this.joystick.release(event.pointerId);
    this.sync();
  };

  /** Касание может оборваться, например при сворачивании приложения. */
  private readonly onCancel = (): void => {
    this.joystick.reset();
    this.sync();
  };
}
