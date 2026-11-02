import { Hero } from './Hero';
import type { GameMap } from './map/GameMap';
import type { MoveInput } from './MoveInput';

/** Всё состояние забега. Работает без Pixi. */
export class World {
  readonly hero: Hero;

  constructor(readonly map: GameMap) {
    this.hero = new Hero(map.heroSpawn.x, map.heroSpawn.y);
  }

  update(dt: number, input: MoveInput): void {
    this.hero.update(dt, input, this.map);
  }
}
