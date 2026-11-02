/** Все числа баланса. Расстояния — в единицах мира, время — в секундах. */
export const BALANCE = {
  hero: {
    /** Единиц в секунду. */
    speed: 220,
    radius: 16,
    maxHealth: 100,
  },
  bow: {
    damage: 15,
    /** Пауза между выстрелами. */
    fireInterval: 0.5,
    /** Радиус, в котором лук видит цели. */
    range: 280,
    projectileSpeed: 520,
    projectileRadius: 4,
    /** Стрела летит чуть дальше радиуса, чтобы догонять убегающую цель. */
    projectileFlightRange: 340,
  },
  enemy: {
    speed: 110,
    radius: 15,
    maxHealth: 30,
    contactDamage: 10,
    /** Как часто один враг может бить при касании. */
    contactInterval: 1,
  },
  waves: {
    firstDelay: 3,
    /** Пауза от начала одной волны до начала следующей. */
    interval: 15,
    baseCount: 4,
    countPerWave: 2,
    /** Пауза между появлением врагов внутри волны. */
    spawnInterval: 0.25,
    /** Больше этого числа живых врагов не появляется. */
    maxAlive: 40,
    /** Враги появляются в этом кольце вокруг героя, за пределами экрана. */
    spawnMinDistance: 480,
    spawnMaxDistance: 900,
  },
  pathfinding: {
    /** Размер клетки сетки, по которой враги ищут путь. */
    cellSize: 40,
    /** Дальше этого расстояния враг не проверяет, видит ли он героя напрямую. */
    directChaseDistance: 300,
  },
  /** Сколько снарядов создать заранее, чтобы не выделять память в бою. */
  projectilePoolSize: 32,
} as const;
