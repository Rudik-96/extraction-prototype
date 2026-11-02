/** Всё, что переживает забег. */
export interface SaveData {
  lootBalance: number;
}

export function createDefaultSave(): SaveData {
  return { lootBalance: 0 };
}

/** Приводит данные из хранилища к рабочему виду: они могли быть испорчены или устареть. */
export function sanitizeSave(raw: unknown): SaveData {
  const save = createDefaultSave();
  if (typeof raw !== 'object' || raw === null) return save;
  const { lootBalance } = raw as Partial<SaveData>;
  if (typeof lootBalance === 'number' && Number.isFinite(lootBalance) && lootBalance >= 0) {
    save.lootBalance = Math.floor(lootBalance);
  }
  return save;
}
