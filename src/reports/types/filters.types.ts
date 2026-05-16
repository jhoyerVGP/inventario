export type DateRangePreset = "today" | "yesterday" | "7d" | "30d" | "custom";

export interface DashboardFilters {
  branchId: string | null;
  preset: DateRangePreset;
  fromDate: string; // ISO date string YYYY-MM-DD
  toDate: string;
}
