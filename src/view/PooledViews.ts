import { Container } from 'pixi.js';
import type { Pool, Poolable } from '../game/Pool';

interface EntityView extends Container {
  render(alpha: number): void;
}

/** Держит по одному виду на каждый объект пула; неактивные просто скрыты. */
export class PooledViews<E extends Poolable, V extends EntityView> extends Container {
  private readonly views: V[] = [];

  constructor(
    private readonly pool: Pool<E>,
    private readonly createView: (entity: E) => V,
  ) {
    super();
  }

  render(alpha: number): void {
    const { items } = this.pool;
    while (this.views.length < items.length) {
      const view = this.createView(items[this.views.length]);
      this.views.push(view);
      this.addChild(view);
    }
    for (let i = 0; i < items.length; i++) {
      const view = this.views[i];
      view.visible = items[i].active;
      if (view.visible) view.render(alpha);
    }
  }
}
