import type { Progress } from '../save/Progress';
import { ScreenScene } from './ScreenScene';
import type { GoTo } from './types';

const subtitleFor = (lootBalance: number): string => `Зайди, собери лут, выберись живым\nЛут: ${lootBalance}`;

export class MenuScene extends ScreenScene {
  private shownBalance: number;

  constructor(
    goTo: GoTo,
    private readonly progress: Progress,
  ) {
    super('Extraction', subtitleFor(progress.lootBalance), [
      { label: 'В забег', primary: true, onTap: () => goTo('run') },
      { label: 'Улучшения', onTap: () => goTo('upgrades') },
    ]);
    this.shownBalance = progress.lootBalance;
  }

  override render(_alpha: number): void {
    if (this.progress.lootBalance === this.shownBalance) return;
    this.shownBalance = this.progress.lootBalance;
    this.subtitle.text = subtitleFor(this.shownBalance);
  }
}
