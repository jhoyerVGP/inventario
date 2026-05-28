import { useState, useMemo } from "react";
import { format, subDays, startOfMonth, subMonths } from "date-fns";
import type { DateRangePreset } from "../types/filters.types";

const today = () => format(new Date(), "yyyy-MM-dd");

const presetRanges: Record<
  DateRangePreset,
  () => { from: string; to: string }
> = {
  today: () => ({ from: today(), to: today() }),
  yesterday: () => ({
    from: format(subDays(new Date(), 1), "yyyy-MM-dd"),
    to: format(subDays(new Date(), 1), "yyyy-MM-dd"),
  }),
  "7d": () => ({
    from: format(subDays(new Date(), 6), "yyyy-MM-dd"),
    to: today(),
  }),
  "30d": () => ({
    from: format(subDays(new Date(), 29), "yyyy-MM-dd"),
    to: today(),
  }),
  custom: () => ({
    from: format(startOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd"),
    to: today(),
  }),
};

export function useDashboardFilters() {
  const [branchId, setBranchId] = useState<string | null>(null);
  const [preset, setPreset] = useState<DateRangePreset>("today");
  const [customFrom, setCustomFrom] = useState<string>(today());
  const [customTo, setCustomTo] = useState<string>(today());

  const { fromDate, toDate } = useMemo(() => {
    if (preset === "custom") return { fromDate: customFrom, toDate: customTo };
    const r = presetRanges[preset]();
    return { fromDate: r.from, toDate: r.to };
  }, [preset, customFrom, customTo]);

  return {
    branchId,
    setBranchId,
    preset,
    setPreset,
    fromDate,
    toDate,
    setCustomFrom,
    setCustomTo,
  };
}
