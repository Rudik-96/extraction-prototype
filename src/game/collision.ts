import type { GameMap, Rect } from './map/GameMap';

export interface CircleBody {
  x: number;
  y: number;
  radius: number;
}

/** Два прохода, чтобы круг не застревал во внутренних углах стен. */
const RESOLVE_PASSES = 2;

/** Выталкивает круг из прямоугольника. */
function resolveCircleRect(body: CircleBody, rect: Rect): void {
  const nearestX = Math.max(rect.x, Math.min(body.x, rect.x + rect.width));
  const nearestY = Math.max(rect.y, Math.min(body.y, rect.y + rect.height));
  const dx = body.x - nearestX;
  const dy = body.y - nearestY;
  const distanceSquared = dx * dx + dy * dy;
  if (distanceSquared >= body.radius * body.radius) return;

  if (distanceSquared > 0) {
    const distance = Math.sqrt(distanceSquared);
    const push = (body.radius - distance) / distance;
    body.x += dx * push;
    body.y += dy * push;
    return;
  }

  // Центр круга внутри прямоугольника: выталкиваем через ближайшую сторону.
  const toLeft = body.x - rect.x;
  const toRight = rect.x + rect.width - body.x;
  const toTop = body.y - rect.y;
  const toBottom = rect.y + rect.height - body.y;
  const nearest = Math.min(toLeft, toRight, toTop, toBottom);
  if (nearest === toLeft) body.x = rect.x - body.radius;
  else if (nearest === toRight) body.x = rect.x + rect.width + body.radius;
  else if (nearest === toTop) body.y = rect.y - body.radius;
  else body.y = rect.y + rect.height + body.radius;
}

/** Ставит круг в допустимое положение: вне стен и в границах карты. */
export function resolveMapCollisions(body: CircleBody, map: GameMap): void {
  for (let pass = 0; pass < RESOLVE_PASSES; pass++) {
    for (const wall of map.walls) resolveCircleRect(body, wall);
    body.x = Math.max(body.radius, Math.min(body.x, map.width - body.radius));
    body.y = Math.max(body.radius, Math.min(body.y, map.height - body.radius));
  }
}

/** Пересекает ли отрезок прямоугольник (метод плит). */
function segmentHitsRect(x0: number, y0: number, x1: number, y1: number, rect: Rect): boolean {
  let tMin = 0;
  let tMax = 1;

  const dx = x1 - x0;
  if (dx === 0) {
    if (x0 < rect.x || x0 > rect.x + rect.width) return false;
  } else {
    const a = (rect.x - x0) / dx;
    const b = (rect.x + rect.width - x0) / dx;
    tMin = Math.max(tMin, Math.min(a, b));
    tMax = Math.min(tMax, Math.max(a, b));
    if (tMin > tMax) return false;
  }

  const dy = y1 - y0;
  if (dy === 0) return y0 >= rect.y && y0 <= rect.y + rect.height;
  const a = (rect.y - y0) / dy;
  const b = (rect.y + rect.height - y0) / dy;
  tMin = Math.max(tMin, Math.min(a, b));
  tMax = Math.min(tMax, Math.max(a, b));
  return tMin <= tMax;
}

/** Нет ли стены на прямой между двумя точками. */
export function hasLineOfSight(x0: number, y0: number, x1: number, y1: number, map: GameMap): boolean {
  for (const wall of map.walls) {
    if (segmentHitsRect(x0, y0, x1, y1, wall)) return false;
  }
  return true;
}

export function isPointInWall(x: number, y: number, map: GameMap): boolean {
  for (const wall of map.walls) {
    if (x >= wall.x && x <= wall.x + wall.width && y >= wall.y && y <= wall.y + wall.height) return true;
  }
  return false;
}

/** Ближе ли точка к стене, чем на clearance. */
export function isNearWall(x: number, y: number, clearance: number, map: GameMap): boolean {
  for (const wall of map.walls) {
    const dx = x - Math.max(wall.x, Math.min(x, wall.x + wall.width));
    const dy = y - Math.max(wall.y, Math.min(y, wall.y + wall.height));
    if (dx * dx + dy * dy < clearance * clearance) return true;
  }
  return false;
}
