import { Container } from 'pixi.js';
import { BALANCE } from '../config/balance';
import { computeHeroStats, type HeroStats, type UpgradeId, type UpgradeLevels } from '../game/upgrades';
import { Button } from './Button';
import { createLabel } from './createLabel';
import { COLORS } from './theme';

const BUTTON_WIDTH = 112;
const BUTTON_HEIGHT = 48;
const TITLE_OFFSET_Y = -13;
const EFFECT_OFFSET_Y = 13;

const NAMES: Record<UpgradeId, string> = {
  damage: 'Урон',
  fireRate: 'Скорость стрельбы',
  range: 'Дальность',
  health: 'Здоровье',
  moveSpeed: 'Скорость бега',
};

const VALUE_FORMATS: Record<UpgradeId, (stats: HeroStats) => string> = {
  damage: (stats) => String(stats.damage),
  fireRate: (stats) => `${stats.shotsPerSecond.toFixed(1)}/с`,
  range: (stats) => String(stats.range),
  health: (stats) => String(stats.maxHealth),
  moveSpeed: (stats) => String(stats.speed),
};

/** Строка улучшения: название, уровень, как изменится значение и кнопка покупки. */
export class UpgradeRow extends Container {
  private readonly title = createLabel('', 18, { bold: true });
  private readonly effect = createLabel('', 15, { color: COLORS.textMuted });
  private readonly buyButton: Button;

  constructor(
    private readonly id: UpgradeId,
    onBuy: () => void,
  ) {
    super();
    this.buyButton = new Button({ label: '', width: BUTTON_WIDTH, height: BUTTON_HEIGHT, primary: true, onTap: onBuy });
    this.title.anchor.set(0, 0.5);
    this.effect.anchor.set(0, 0.5);
    this.title.y = TITLE_OFFSET_Y;
    this.effect.y = EFFECT_OFFSET_Y;
    this.addChild(this.title, this.effect, this.buyButton);
  }

  /** Ширина строки; левый край строки — её точка отсчёта. */
  setWidth(width: number): void {
    this.buyButton.x = width - BUTTON_WIDTH / 2;
  }

  update(levels: UpgradeLevels, cost: number | null, balance: number): void {
    const { id } = this;
    const level = levels[id];
    const format = VALUE_FORMATS[id];
    const current = format(computeHeroStats(levels));

    this.title.text = `${NAMES[id]} · ${level}/${BALANCE.upgrades.maxLevel}`;
    if (cost === null) {
      this.effect.text = current;
      this.buyButton.setLabel('Макс');
      this.buyButton.setEnabled(false);
      return;
    }
    this.effect.text = `${current} → ${format(computeHeroStats({ ...levels, [id]: level + 1 }))}`;
    this.buyButton.setLabel(`${cost} лута`);
    this.buyButton.setEnabled(cost <= balance);
  }
}
