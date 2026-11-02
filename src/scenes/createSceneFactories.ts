import type { Progress } from '../save/Progress';
import { MenuScene } from './MenuScene';
import { ResultScene } from './ResultScene';
import { RunScene } from './RunScene';
import type { GoTo, SceneFactories } from './types';
import { UpgradesScene } from './UpgradesScene';

export function createSceneFactories(goTo: GoTo, progress: Progress): SceneFactories {
  return {
    menu: () => new MenuScene(goTo, progress),
    run: () => new RunScene(goTo, progress),
    result: (params) => new ResultScene(goTo, progress, params),
    upgrades: () => new UpgradesScene(goTo, progress),
  };
}
