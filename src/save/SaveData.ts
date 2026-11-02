import { BALANCE } from '../config/balance';
import { createDefaultLevels, UPGRADE_IDS, type UpgradeLevels } from '../game/upgrades';

/** Всё, что переживает забег. */
export interface SaveData {
  lootBalance: number;
  upgrades: UpgradeLevels;
}

export function createDefaultSave(): SaveData {
  return { lootBalance: 0, upgrades: createDefaultLevels() };
}

const isValidCount = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;

/** Приводит данные из хранилища к рабочему виду: они могли быть испорчены или устареть. */
export function sanitizeSave(raw: unknown): SaveData {
  const save = createDefaultSave();
  if (typeof raw !== 'object' || raw === null) return save;

  const { lootBalance, upgrades } = raw as { lootBalance?: unknown; upgrades?: unknown };
  if (isValidCount(lootBalance)) save.lootBalance = Math.floor(lootBalance);
  if (typeof upgrades === 'object' && upgrades !== null) {
    const levels = upgrades as Record<string, unknown>;
    for (const id of UPGRADE_IDS) {
      const level = levels[id];
      if (isValidCount(level)) save.upgrades[id] = Math.min(Math.floor(level), BALANCE.upgrades.maxLevel);
    }
  }
  return save;
}
