import { Graphics } from 'pixi.js';
import type { GameMap } from '../game/map/GameMap';
import { WORLD_COLORS } from './palette';

/** Сетка нужна, чтобы движение было заметно на пустом полу. */
const GRID_STEP = 100;

/** Карта статична, поэтому рисуется один раз. */
export class MapView extends Graphics {
  constructor(map: GameMap) {
    super();
    this.rect(0, 0, map.width, map.height).fill(WORLD_COLORS.floor);

    for (let x = GRID_STEP; x < map.width; x += GRID_STEP) this.moveTo(x, 0).lineTo(x, map.height);
    for (let y = GRID_STEP; y < map.height; y += GRID_STEP) this.moveTo(0, y).lineTo(map.width, y);
    this.stroke({ width: 2, color: WORLD_COLORS.gridLine });

    for (const wall of map.walls) this.rect(wall.x, wall.y, wall.width, wall.height);
    this.fill(WORLD_COLORS.wall);
  }
}
