import type { World } from '../game/World';

/** Что отладочная панель знает об игре и что может в ней менять. */
export class DebugState {
  immortal = false;
  /** Мир текущего забега; null вне забега. */
  world: World | null = null;
}
