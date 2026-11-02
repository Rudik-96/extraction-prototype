/** Где лежит сохранение. Асинхронно, потому что облачное хранилище иначе не работает. */
export interface ProgressStorage {
  /** Возвращает сырые данные или null, если сохранения нет. */
  load(): Promise<unknown>;
  save(data: unknown): Promise<void>;
}
