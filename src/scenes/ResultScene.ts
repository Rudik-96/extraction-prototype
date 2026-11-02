import type { Progress } from '../save/Progress';
import { formatTime } from '../ui/formatTime';
import { ScreenScene } from './ScreenScene';
import type { GoTo, RunResult } from './types';

const OUTCOME_TITLES: Record<RunResult['outcome'], string> = {
  extracted: 'Ты выбрался!',
  died: 'Ты погиб',
  timeout: 'Время вышло',
};

export class ResultScene extends ScreenScene {
  constructor(goTo: GoTo, progress: Progress, { outcome, lootValue, kills, duration }: RunResult) {
    const lootLine = outcome === 'extracted' ? `Лут сохранён: ${lootValue}` : `Лут потерян: ${lootValue}`;
    const subtitle = [
      lootLine,
      `Всего лута: ${progress.lootBalance}`,
      `Убито врагов: ${kills}`,
      `Время: ${formatTime(duration)}`,
    ].join('\n');
    super(OUTCOME_TITLES[outcome], subtitle, [
      { label: 'Ещё забег', primary: true, onTap: () => goTo('run') },
      { label: 'Улучшения', onTap: () => goTo('upgrades') },
      { label: 'В меню', onTap: () => goTo('menu') },
    ]);
  }
}
