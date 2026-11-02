import type { Progress } from '../save/Progress';
import { ScreenScene } from './ScreenScene';
import type { GoTo } from './types';

export class UpgradesScene extends ScreenScene {
  constructor(goTo: GoTo, progress: Progress) {
    super('Улучшения', `Лут: ${progress.lootBalance}\nПоявятся на этапе 5`, [
      { label: 'В меню', onTap: () => goTo('menu') },
    ]);
  }
}
