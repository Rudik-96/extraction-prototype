import type { Scene } from '../core/Scene';
import type { RunOutcome } from '../game/World';

export interface RunResult {
  outcome: RunOutcome;
  lootValue: number;
  kills: number;
  /** Сколько длился забег, секунды. */
  duration: number;
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
