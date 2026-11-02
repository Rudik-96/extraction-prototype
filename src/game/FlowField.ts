import { isNearWall } from './collision';
import type { GameMap } from './map/GameMap';

const UNREACHED = -1;
/** Смещения восьми соседних клеток: сначала прямые, затем диагональные. */
const NEIGHBOR_DX = [1, -1, 0, 0, 1, 1, -1, -1];
const NEIGHBOR_DY = [0, 0, 1, -1, 1, -1, 1, -1];
const STRAIGHT_NEIGHBORS = 4;

export interface Vector {
  x: number;
  y: number;
}

/**
 * Поле направлений: один обход сетки от героя даёт путь сразу всем врагам,
 * поэтому цена не зависит от их числа. Пересчёт — только когда герой сменил клетку.
 */
export class FlowField {
  private readonly cols: number;
  private readonly rows: number;
  private readonly blocked: Uint8Array;
  private readonly distance: Int32Array;
  private readonly queue: Int32Array;
  private targetCell = -1;

  constructor(
    map: GameMap,
    private readonly cellSize: number,
    clearance: number,
  ) {
    this.cols = Math.ceil(map.width / cellSize);
    this.rows = Math.ceil(map.height / cellSize);
    const cellCount = this.cols * this.rows;
    this.blocked = new Uint8Array(cellCount);
    this.distance = new Int32Array(cellCount).fill(UNREACHED);
    this.queue = new Int32Array(cellCount);

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const near = isNearWall((col + 0.5) * cellSize, (row + 0.5) * cellSize, clearance, map);
        this.blocked[row * this.cols + col] = near ? 1 : 0;
      }
    }
  }

  setTarget(x: number, y: number): void {
    const cell = this.cellAt(x, y);
    if (cell === this.targetCell) return;
    this.targetCell = cell;

    const { cols, rows, blocked, distance, queue } = this;
    distance.fill(UNREACHED);
    distance[cell] = 0;
    queue[0] = cell;
    let head = 0;
    let tail = 1;
    while (head < tail) {
      const current = queue[head++];
      const col = current % cols;
      const row = (current - col) / cols;
      for (let i = 0; i < STRAIGHT_NEIGHBORS; i++) {
        const nextCol = col + NEIGHBOR_DX[i];
        const nextRow = row + NEIGHBOR_DY[i];
        if (nextCol < 0 || nextRow < 0 || nextCol >= cols || nextRow >= rows) continue;
        const next = nextRow * cols + nextCol;
        if (blocked[next] || distance[next] !== UNREACHED) continue;
        distance[next] = distance[current] + 1;
        queue[tail++] = next;
      }
    }
  }

  /** Есть ли отсюда путь до цели. */
  isReachable(x: number, y: number): boolean {
    const cell = this.cellAt(x, y);
    return !this.blocked[cell] && this.distance[cell] !== UNREACHED;
  }

  /**
   * Записывает в out единичное направление на следующую клетку пути.
   * Возвращает false, если идти по сетке некуда: враг уже в клетке героя.
   */
  writeDirection(x: number, y: number, out: Vector): boolean {
    const { cols, rows, blocked, distance, cellSize } = this;
    const cell = this.cellAt(x, y);
    const col = cell % cols;
    const row = (cell - col) / cols;

    let best = -1;
    let bestDistance = blocked[cell] || distance[cell] === UNREACHED ? Infinity : distance[cell];
    for (let i = 0; i < NEIGHBOR_DX.length; i++) {
      const nextCol = col + NEIGHBOR_DX[i];
      const nextRow = row + NEIGHBOR_DY[i];
      if (nextCol < 0 || nextRow < 0 || nextCol >= cols || nextRow >= rows) continue;
      const next = nextRow * cols + nextCol;
      const nextDistance = distance[next];
      if (nextDistance === UNREACHED || nextDistance >= bestDistance) continue;
      // По диагонали можно, только если не срезаем угол стены.
      if (i >= STRAIGHT_NEIGHBORS && (blocked[row * cols + nextCol] || blocked[nextRow * cols + col])) continue;
      best = next;
      bestDistance = nextDistance;
    }
    if (best === -1) return false;

    const bestCol = best % cols;
    const bestRow = (best - bestCol) / cols;
    const dx = (bestCol + 0.5) * cellSize - x;
    const dy = (bestRow + 0.5) * cellSize - y;
    const length = Math.hypot(dx, dy) || 1;
    out.x = dx / length;
    out.y = dy / length;
    return true;
  }

  private cellAt(x: number, y: number): number {
    const col = Math.max(0, Math.min(this.cols - 1, Math.floor(x / this.cellSize)));
    const row = Math.max(0, Math.min(this.rows - 1, Math.floor(y / this.cellSize)));
    return row * this.cols + col;
  }
}
