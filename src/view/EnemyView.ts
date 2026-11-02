import { Container, Graphics, GraphicsContext } from 'pixi.js';
import { BALANCE } from '../config/balance';
import type { Enemy } from '../game/Enemy';
import { HealthBar } from './HealthBar';
import { WORLD_COLORS } from './palette';

const BAR_WIDTH = 30;
const AWAKE_TINT = 0xffffff;
const DORMANT_TINT = 0x8f8f8f;

/** Одна геометрия на всех врагов: так они рисуются одним вызовом. */
const bodyContext = new GraphicsContext().circle(0, 0, BALANCE.enemy.radius).fill(WORLD_COLORS.enemy);

export class EnemyView extends Container {
  private readonly healthBar = new HealthBar(BAR_WIDTH, WORLD_COLORS.healthBarEnemy);
  private readonly body = new Graphics(bodyContext);

  constructor(private readonly enemy: Enemy) {
    super();
    this.healthBar.y = -enemy.radius - 8;
    this.addChild(this.body, this.healthBar);
  }

  render(alpha: number): void {
    const { enemy } = this;
    this.position.set(enemy.prevX + (enemy.x - enemy.prevX) * alpha, enemy.prevY + (enemy.y - enemy.prevY) * alpha);
    this.body.tint = enemy.dormant ? DORMANT_TINT : AWAKE_TINT;
    // У целого врага полоска не нужна: на экране и без неё тесно.
    const damaged = enemy.health < enemy.maxHealth;
    this.healthBar.visible = damaged;
    if (damaged) this.healthBar.setRatio(enemy.health / enemy.maxHealth);
  }
}
