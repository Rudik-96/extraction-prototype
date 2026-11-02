import type { GameMap, Rect } from './GameMap';

const THICKNESS = 40;

const wall = (x: number, y: number, width: number, height: number): Rect => ({ x, y, width, height });

/** Карта-прототип: старт внизу, две закрытые комнаты наверху. */
export const mainMap: GameMap = {
  width: 1600,
  height: 2400,
  heroSpawn: { x: 800, y: 2050 },
  walls: [
    // Загородка у старта с проходом посередине.
    wall(250, 1900, 450, THICKNESS),
    wall(900, 1900, 450, THICKNESS),
    wall(250, 1900, THICKNESS, 250),
    wall(1310, 1900, THICKNESS, 250),

    // Открытая середина.
    wall(150, 1650, 120, THICKNESS),
    wall(1330, 1650, 120, THICKNESS),
    wall(350, 1500, 160, 160),
    wall(1090, 1500, 160, 160),
    wall(720, 1350, 160, 160),

    // Стена поперёк карты с проходом в центре.
    wall(0, 1150, 600, THICKNESS),
    wall(1000, 1150, 600, THICKNESS),

    // Левая комната, дверь снизу справа.
    wall(200, 300, 500, THICKNESS),
    wall(200, 300, THICKNESS, 500),
    wall(660, 300, THICKNESS, 300),
    wall(200, 800, 300, THICKNESS),

    // Правая комната, дверь снизу слева.
    wall(900, 300, 500, THICKNESS),
    wall(1360, 300, THICKNESS, 500),
    wall(900, 300, THICKNESS, 300),
    wall(1100, 800, 300, THICKNESS),

    // Укрытие между комнатами.
    wall(750, 800, 100, 100),
  ],
};
