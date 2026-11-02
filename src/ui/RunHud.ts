import { Container } from 'pixi.js';
import type { ScreenSize } from '../core/Viewport';
import type { World } from '../game/World';
import { createLabel } from './createLabel';
import { formatTime } from './formatTime';
import { COLORS } from './theme';

const MARGIN = 14;
const TIMER_Y = 32;
/** С этого момента таймер красный. */
const TIMER_WARNING_SECONDS = 30;

/** Показатели забега. Перерисовка Text дорогая, поэтому текст меняется только при смене значения. */
export class RunHud extends Container {
  private readonly timer = createLabel('', 26, { bold: true });
  private readonly loot = createLabel('', 18, { bold: true });
  private readonly wave = createLabel('', 15, { color: COLORS.textMuted });
  private shownSeconds = -1;
  private shownLoot = -1;
  private shownWave = -1;

  constructor() {
    super();
    this.loot.anchor.set(0, 0.5);
    this.wave.anchor.set(0, 0.5);
    this.loot.position.set(MARGIN, 26);
    this.wave.position.set(MARGIN, 50);
    this.addChild(this.timer, this.loot, this.wave);
  }

  resize({ width }: ScreenSize): void {
    this.timer.position.set(width / 2, TIMER_Y);
  }

  render(world: World): void {
    const seconds = Math.ceil(world.timeLeft);
    if (seconds !== this.shownSeconds) {
      this.shownSeconds = seconds;
      this.timer.text = formatTime(seconds);
      this.timer.style.fill = seconds <= TIMER_WARNING_SECONDS ? COLORS.danger : COLORS.text;
    }
    if (world.lootCollected !== this.shownLoot) {
      this.shownLoot = world.lootCollected;
      this.loot.text = `Лут: ${world.lootCollected}`;
    }
    if (world.spawner.waveNumber !== this.shownWave) {
      this.shownWave = world.spawner.waveNumber;
      this.wave.text = `Волна ${world.spawner.waveNumber}`;
    }
  }
}
