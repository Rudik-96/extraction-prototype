import type { Scene } from '../core/Scene';

export type RunOutcome = 'extracted' | 'died' | 'timeout';

export interface RunResult {
  outcome: RunOutcome;
  lootValue: number;
}

/** Какие сцены есть и какие параметры нужны для перехода в каждую. */
export interface SceneParams {
  menu: undefined;
  run: undefined;
  result: RunResult;
  upgrades: undefined;
}

export type SceneId = keyof SceneParams;

export type SceneFactories = { [K in SceneId]: (params: SceneParams[K]) => Scene };

export type GoToArgs<K extends SceneId> = SceneParams[K] extends undefined ? [] : [params: SceneParams[K]];

export type GoTo = <K extends SceneId>(id: K, ...args: GoToArgs<K>) => void;
