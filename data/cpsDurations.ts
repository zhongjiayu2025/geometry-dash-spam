export const CPS_DURATIONS = [1, 3, 5, 10, 30, 60] as const;

export const CPS_DURATION_LABEL = CPS_DURATIONS.join(", ").replace(/, ([^,]*)$/, " and $1");
