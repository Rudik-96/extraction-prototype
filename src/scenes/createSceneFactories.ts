import { MenuScene } from './MenuScene';
import { ResultScene } from './ResultScene';
import { RunScene } from './RunScene';
import type { GoTo, SceneFactories } from './types';
import { UpgradesScene } from './UpgradesScene';

export function createSceneFactories(goTo: GoTo): SceneFactories {
  return {
    menu: () => new MenuScene(goTo),
    run: () => new RunScene(goTo),
    result: (params) => new ResultScene(goTo, params),
    upgrades: () => new UpgradesScene(goTo),
  };
}
