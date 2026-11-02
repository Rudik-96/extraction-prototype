import { Container, Graphics } from 'pixi.js';
import { BALANCE } from '../config/balance';
import type { Hero } from '../game/Hero';
import { HealthBar } from './HealthBar';
import { WORLD_COLORS } from './palette';

const BAR_WIDTH = 40;

/** Визуальное представление героя. При переходе на Spine заменится только этот класс. */
export class HeroView extends Container {
  private readonly body = new Container();
  private readonly healthBar = new HealthBar(BAR_WIDTH, WORLD_COLORS.healthBarHero);

  constructor(private readonly hero: Hero) {
    super();
    const rangeCircle = new Graphics()
      .circle(0, 0, BALANCE.bow.range)
      .stroke({ width: 2, color: WORLD_COLORS.bowRange, alpha: 0.15 });
    this.body.addChild(
      new Graphics().circle(0, 0, hero.radius).fill(WORLD_COLORS.hero),
      new Graphics().circle(hero.radius * 0.6, 0, hero.radius * 0.25).fill(WORLD_COLORS.heroFacing),
    );
    this.healthBar.y = -hero.radius - 10;
    this.addChild(rangeCircle, this.body, this.healthBar);
  }

  render(alpha: number): void {
    const { hero } = this;
    this.position.set(hero.prevX + (hero.x - hero.prevX) * alpha, hero.prevY + (hero.y - hero.prevY) * alpha);
    this.body.rotation = hero.facing;
    this.healthBar.setRatio(hero.health / hero.maxHealth);
  }
}
