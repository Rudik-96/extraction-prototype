import type { ProgressStorage } from './ProgressStorage';
import { createDefaultSave, type SaveData, sanitizeSave } from './SaveData';

/** Прогресс игрока в памяти. Игра читает его сразу, а запись идёт в хранилище фоном. */
export class Progress {
  private constructor(
    private readonly storage: ProgressStorage,
    private readonly data: SaveData,
  ) {}

  static async load(storage: ProgressStorage): Promise<Progress> {
    try {
      return new Progress(storage, sanitizeSave(await storage.load()));
    } catch (error) {
      // Без сохранения игра всё равно должна запуститься.
      console.error('Не удалось прочитать сохранение', error);
      return new Progress(storage, createDefaultSave());
    }
  }

  get lootBalance(): number {
    return this.data.lootBalance;
  }

  addLoot(amount: number): void {
    this.data.lootBalance += amount;
    this.persist();
  }

  private persist(): void {
    this.storage.save(this.data).catch((error: unknown) => {
      console.error('Не удалось записать сохранение', error);
    });
  }
}
