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
