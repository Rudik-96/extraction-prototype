import { Container } from 'pixi.js';
import type { Scene } from '../core/Scene';
import type { ScreenSize } from '../core/Viewport';
import { UPGRADE_IDS, type UpgradeLevels } from '../game/upgrades';
import type { Progress } from '../save/Progress';
import { Button } from '../ui/Button';
import { createLabel } from '../ui/createLabel';
import { COLORS } from '../ui/theme';
import { UpgradeRow } from '../ui/UpgradeRow';
import type { GoTo } from './types';

const SIDE_MARGIN = 20;
const TITLE_Y = 50;
const BALANCE_Y = 92;
const FIRST_ROW_Y = 150;
const ROW_SPACING = 84;
const BACK_BUTTON_BOTTOM_OFFSET = 50;

export class UpgradesScene implements Scene {
  readonly view = new Container();
  private readonly title = createLabel('Улучшения', 30, { bold: true });
  private readonly balance = createLabel('', 20, { bold: true, color: COLORS.textMuted });
  private readonly rows: UpgradeRow[];
  private readonly backButton: Button;
  private shownBalance = -1;

  constructor(
    goTo: GoTo,
    private readonly progress: Progress,
  ) {
    this.rows = UPGRADE_IDS.map(
      (id) =>
        new UpgradeRow(id, () => {
          if (progress.buyUpgrade(id)) this.refresh();
        }),
    );
    this.backButton = new Button({ label: 'В меню', onTap: () => goTo('menu') });
    this.view.addChild(this.title, this.balance, ...this.rows, this.backButton);
    this.refresh();
  }

  resize({ width, height }: ScreenSize): void {
    this.title.position.set(width / 2, TITLE_Y);
    this.balance.position.set(width / 2, BALANCE_Y);
    this.rows.forEach((row, index) => {
      row.position.set(SIDE_MARGIN, FIRST_ROW_Y + index * ROW_SPACING);
      row.setWidth(width - SIDE_MARGIN * 2);
    });
    this.backButton.position.set(width / 2, height - BACK_BUTTON_BOTTOM_OFFSET);
  }

  fixedUpdate(_dt: number): void {}

  render(_alpha: number): void {
    // Запас мог измениться и не через покупку, например из отладочной панели.
    if (this.progress.lootBalance !== this.shownBalance) this.refresh();
  }

  destroy(): void {
    this.view.destroy({ children: true });
  }

  private refresh(): void {
    const { progress } = this;
    this.shownBalance = progress.lootBalance;
    const levels = {} as UpgradeLevels;
    for (const id of UPGRADE_IDS) levels[id] = progress.upgradeLevel(id);

    this.balance.text = `Лут: ${progress.lootBalance}`;
    UPGRADE_IDS.forEach((id, index) => {
      this.rows[index].update(levels, progress.upgradeCost(id), progress.lootBalance);
    });
  }
}
