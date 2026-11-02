import { ScreenScene } from './ScreenScene';
import type { GoTo } from './types';

export class UpgradesScene extends ScreenScene {
  constructor(goTo: GoTo) {
    super('Улучшения', 'Появятся на этапе 5', [{ label: 'В меню', onTap: () => goTo('menu') }]);
  }
}
