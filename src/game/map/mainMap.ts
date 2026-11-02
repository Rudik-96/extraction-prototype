import type { GameMap, LootPlacement, LootTier, Point, Rect } from './GameMap';

const THICKNESS = 40;

const wall = (x: number, y: number, width: number, height: number): Rect => ({ x, y, width, height });
const loot = (tier: LootTier, x: number, y: number): LootPlacement => ({ tier, x, y });
const guard = (x: number, y: number): Point => ({ x, y });

/** Карта-прототип: старт и выход внизу, а самый ценный лут под охраной в комнатах наверху. */
export const mainMap: GameMap = {
  width: 1600,
  height: 2400,
  heroSpawn: { x: 800, y: 2050 },
  exit: { x: 1470, y: 2270 },
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
  loot: [
    // Мелочь внизу и в середине: почти без риска.
    loot('small', 800, 2300),
    loot('small', 400, 2250),
    loot('small', 1150, 2250),
    loot('small', 150, 2000),
    loot('small', 1450, 1950),
    loot('small', 800, 1800),
    loot('small', 500, 1800),
    loot('small', 1100, 1800),
    loot('small', 200, 1500),
    loot('small', 1400, 1500),
    loot('small', 600, 1300),
    loot('small', 1000, 1300),
    loot('small', 300, 1250),
    loot('small', 1300, 1250),
    loot('small', 800, 1050),

    // Средний лут дальше от выхода.
    loot('medium', 430, 1440),
    loot('medium', 1170, 1440),
    loot('medium', 800, 1270),
    loot('medium', 100, 1000),
    loot('medium', 1500, 1000),
    loot('medium', 800, 600),
    loot('medium', 100, 150),
    loot('medium', 1500, 150),

    // Ценный лут в комнатах под охраной.
    loot('large', 350, 450),
    loot('large', 480, 560),
    loot('large', 1250, 450),
    loot('large', 1120, 560),
  ],
  guards: [
    // Левая комната.
    guard(300, 560),
    guard(420, 430),
    guard(540, 480),
    guard(350, 680),

    // Правая комната.
    guard(1300, 560),
    guard(1180, 430),
    guard(1060, 480),
    guard(1250, 680),

    // Средний лут в центре наверху и в дальних углах.
    guard(760, 660),
    guard(150, 200),
    guard(1450, 200),
  ],
};
