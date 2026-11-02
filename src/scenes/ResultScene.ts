import { ScreenScene } from './ScreenScene';
import type { GoTo, RunOutcome, RunResult } from './types';

const OUTCOME_TITLES: Record<RunOutcome, string> = {
  extracted: 'Ты выбрался!',
  died: 'Ты погиб',
  timeout: 'Время вышло',
};

export class ResultScene extends ScreenScene {
  constructor(goTo: GoTo, { outcome, lootValue }: RunResult) {
    const subtitle = outcome === 'extracted' ? `Лут сохранён: ${lootValue}` : `Лут потерян: ${lootValue}`;
    super(OUTCOME_TITLES[outcome], subtitle, [
      { label: 'Ещё забег', primary: true, onTap: () => goTo('run') },
      { label: 'Улучшения', onTap: () => goTo('upgrades') },
      { label: 'В меню', onTap: () => goTo('menu') },
    ]);
  }
}
