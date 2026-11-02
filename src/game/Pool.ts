export interface Poolable {
  active: boolean;
}

/**
 * Пул переиспользуемых объектов. Объекты никогда не удаляются и не меняют индекс,
 * поэтому у каждого может быть постоянный вид (см. PooledViews).
 */
export class Pool<T extends Poolable> {
  /** Все созданные объекты, активные и нет. При обходе нужно проверять active. */
  readonly items: T[] = [];
  activeCount = 0;
  private readonly free: T[] = [];

  constructor(
    private readonly create: () => T,
    prewarm: number,
  ) {
    for (let i = 0; i < prewarm; i++) this.free.push(this.createItem());
  }

  acquire(): T {
    const item = this.free.pop() ?? this.createItem();
    item.active = true;
    this.activeCount += 1;
    return item;
  }

  release(item: T): void {
    if (!item.active) return;
    item.active = false;
    this.activeCount -= 1;
    this.free.push(item);
  }

  private createItem(): T {
    const item = this.create();
    item.active = false;
    this.items.push(item);
    return item;
  }
}
