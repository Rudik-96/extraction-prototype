import type { ProgressStorage } from './ProgressStorage';

const STORAGE_KEY = 'extraction-prototype.save.v1';

export class LocalStorageProgressStorage implements ProgressStorage {
  async load(): Promise<unknown> {
    const json = localStorage.getItem(STORAGE_KEY);
    return json === null ? null : JSON.parse(json);
  }

  async save(data: unknown): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}
