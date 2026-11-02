import { ScreenScene } from './ScreenScene';
import type { GoTo } from './types';

export class MenuScene extends ScreenScene {
  constructor(goTo: GoTo) {
    super('Extraction', 'Зайди, собери лут, выберись живым', [
      { label: 'В забег', primary: true, onTap: () => goTo('run') },
      { label: 'Улучшения', onTap: () => goTo('upgrades') },
    ]);
  }
}
