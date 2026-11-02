import { Container, Graphics, type Text } from 'pixi.js';
import { DEBUG } from '../config/display';
import type { ScreenSize } from '../core/Viewport';
import type { Pool, Poolable } from '../game/Pool';
import type { Progress } from '../save/Progress';
import { Button } from '../ui/Button';
import { createLabel } from '../ui/createLabel';
import type { DebugState } from './DebugState';

const TOGGLE = { width: 46, height: 30, margin: 8 };
const PANEL = { x: 12, y: 70, width: 176, height: 196, padding: 8 };
const ACTION_BUTTON_HEIGHT = 36;
const FIRST_ACTION_Y = 196;
const ACTION_SPACING = 42;
const STATS_INTERVAL = 0.5;

const countOf = (pool: Pool<Poolable>): string => `${pool.activeCount}/${pool.items.length}`;

function countNodes(node: Container): number {
  let count = 1;
  for (const child of node.children) count += countNodes(child);
  return count;
}

/** Панель поверх всех сцен: FPS, число объектов и кнопки для быстрого теста. */
export class DebugOverlay extends Container {
  private readonly toggle: Button;
  private readonly panel = new Container();
  private readonly stats: Text;
  private readonly immortalButton: Button;
  private frames = 0;
  private elapsed = 0;

  constructor(
    private readonly debug: DebugState,
    progress: Progress,
    private readonly stage: Container,
  ) {
    super();
    this.toggle = new Button({
      label: 'DBG',
      width: TOGGLE.width,
      height: TOGGLE.height,
      fontSize: 13,
      onTap: () => this.setPanelVisible(!this.panel.visible),
    });

    const background = new Graphics()
      .roundRect(PANEL.x, PANEL.y, PANEL.width, PANEL.height, 8)
      .fill({ color: 0x000000, alpha: 0.7 });
    this.stats = createLabel('', 13);
    this.stats.anchor.set(0, 0);
    this.stats.style.align = 'left';
    this.stats.position.set(PANEL.x + PANEL.padding, PANEL.y + PANEL.padding);

    this.immortalButton = this.createAction(0, '', () => {
      debug.immortal = !debug.immortal;
      this.syncImmortalLabels();
    });
    const addLootButton = this.createAction(1, `Лут +${DEBUG.addLootAmount}`, () => {
      progress.addLoot(DEBUG.addLootAmount);
    });

    this.panel.addChild(background, this.stats, this.immortalButton, addLootButton);
    this.panel.visible = false;
    this.addChild(this.panel, this.toggle);
    this.syncImmortalLabels();
  }

  resize({ height }: ScreenSize): void {
    this.toggle.position.set(TOGGLE.margin + TOGGLE.width / 2, height - TOGGLE.margin - TOGGLE.height / 2);
  }

  /** Вызывается раз в кадр. Текст меняется редко: его перерисовка сама стоит времени. */
  update(frameTime: number): void {
    this.frames += 1;
    this.elapsed += frameTime;
    if (this.elapsed < STATS_INTERVAL) return;

    if (this.panel.visible) this.showStats(this.frames / this.elapsed);
    this.frames = 0;
    this.elapsed = 0;
  }

  private createAction(index: number, label: string, onTap: () => void): Button {
    const button = new Button({
      label,
      width: PANEL.width - PANEL.padding * 2,
      height: ACTION_BUTTON_HEIGHT,
      fontSize: 14,
      onTap,
    });
    button.position.set(PANEL.x + PANEL.width / 2, FIRST_ACTION_Y + index * ACTION_SPACING);
    return button;
  }

  private setPanelVisible(visible: boolean): void {
    this.panel.visible = visible;
    if (visible) this.showStats(this.elapsed > 0 ? this.frames / this.elapsed : 0);
  }

  private syncImmortalLabels(): void {
    const { immortal } = this.debug;
    this.immortalButton.setLabel(`Бессмертие: ${immortal ? 'вкл' : 'выкл'}`);
    // Чтобы не забыть о бессмертии, когда панель закрыта.
    this.toggle.setLabel(immortal ? 'DBG*' : 'DBG');
  }

  private showStats(fps: number): void {
    const lines = [`FPS: ${Math.round(fps)}`, `Узлов Pixi: ${countNodes(this.stage)}`];
    const { world } = this.debug;
    if (world) {
      lines.push(
        `Враги: ${countOf(world.enemies)}`,
        `Снаряды: ${countOf(world.projectiles)}`,
        `Лут: ${countOf(world.loot)}`,
      );
    }
    this.stats.text = lines.join('\n');
  }
}
