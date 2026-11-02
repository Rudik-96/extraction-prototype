import type { Progress } from '../save/Progress';
import { ScreenScene } from './ScreenScene';
import type { GoTo } from './types';

export class MenuScene extends ScreenScene {
  constructor(goTo: GoTo, progress: Progress) {
    super('Extraction', `Зайди, собери лут, выберись живым\nЛут: ${progress.lootBalance}`, [
      { label: 'В забег', primary: true, onTap: () => goTo('run') },
      { label: 'Улучшения', onTap: () => goTo('upgrades') },
    ]);
  }
}
