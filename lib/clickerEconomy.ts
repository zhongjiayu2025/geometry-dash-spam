export const clickCostFor = (level: number) =>
  Math.floor(25 * Math.pow(1.65, level - 1));

export const autoCostFor = (level: number) =>
  Math.floor(80 * Math.pow(1.75, level));

export const prestigeCostFor = (prestige: number) =>
  10000 * (prestige + 1);
