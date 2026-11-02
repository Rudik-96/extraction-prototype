import { Container, Graphics } from 'pixi.js';
import type { Hero } from '../game/Hero';
import { WORLD_COLORS } from './palette';

/** Визуальное представление героя. При переходе на Spine заменится только этот класс. */
export class HeroView extends Container {
  constructor(private readonly hero: Hero) {
    super();
    const body = new Graphics().circle(0, 0, hero.radius).fill(WORLD_COLORS.hero);
    const facingMark = new Graphics().circle(hero.radius * 0.6, 0, hero.radius * 0.25).fill(WORLD_COLORS.heroFacing);
    this.addChild(body, facingMark);
  }

  render(alpha: number): void {
    const { hero } = this;
    this.position.set(hero.prevX + (hero.x - hero.prevX) * alpha, hero.prevY + (hero.y - hero.prevY) * alpha);
    this.rotation = hero.facing;
  }
}
