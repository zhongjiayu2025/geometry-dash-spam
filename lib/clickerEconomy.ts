export type ClickerState = {
  orbs: number;
  clickPower: number;
  autoPower: number;
  prestige: number;
  totalClicks: number;
};

export const INITIAL_CLICKER_STATE: ClickerState = {
  orbs: 0,
  clickPower: 1,
  autoPower: 0,
  prestige: 0,
  totalClicks: 0,
};

const MAX_VALUE = Number.MAX_SAFE_INTEGER;

function safeNumber(value: unknown, fallback: number) {
  if (typeof value !== "number" && typeof value !== "string") return fallback;
  if (typeof value === "string" && !value.trim()) return fallback;
  const number = Number(value);
  if (Number.isNaN(number) || number < 0) return fallback;
  if (number === Infinity) return MAX_VALUE;
  if (!Number.isFinite(number)) return fallback;
  return Math.min(number, MAX_VALUE);
}

function safeCost(value: number) {
  return Number.isFinite(value) ? Math.min(MAX_VALUE, Math.floor(value)) : MAX_VALUE;
}

export function normalizeClickerState(value: unknown): ClickerState {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return INITIAL_CLICKER_STATE;
  }

  const record = value as Record<string, unknown>;
  return {
    orbs: safeNumber(record.orbs, 0),
    clickPower: Math.max(1, Math.floor(safeNumber(record.clickPower, 1))),
    autoPower: Math.floor(safeNumber(record.autoPower, 0)),
    prestige: Math.floor(safeNumber(record.prestige, 0)),
    totalClicks: Math.floor(safeNumber(record.totalClicks, 0)),
  };
}

export const clickCostFor = (level: number) =>
  safeCost(25 * Math.pow(1.65, level - 1));

export const autoCostFor = (level: number) =>
  safeCost(80 * Math.pow(1.75, level));

export const prestigeCostFor = (prestige: number) =>
  safeCost(10000 * (prestige + 1));

export function buyClickUpgrade(state: ClickerState): ClickerState {
  if (state.clickPower >= MAX_VALUE) return state;
  const cost = clickCostFor(state.clickPower);
  if (state.orbs < cost) return state;
  return { ...state, orbs: state.orbs - cost, clickPower: state.clickPower + 1 };
}

export function buyAutoUpgrade(state: ClickerState): ClickerState {
  if (state.autoPower >= MAX_VALUE) return state;
  const cost = autoCostFor(state.autoPower);
  if (state.orbs < cost) return state;
  return { ...state, orbs: state.orbs - cost, autoPower: state.autoPower + 1 };
}

export function buyPrestigeUpgrade(state: ClickerState): ClickerState {
  if (state.prestige >= MAX_VALUE) return state;
  const cost = prestigeCostFor(state.prestige);
  if (state.orbs < cost) return state;
  return {
    orbs: 0,
    clickPower: 1,
    autoPower: 0,
    prestige: state.prestige + 1,
    totalClicks: state.totalClicks,
  };
}
