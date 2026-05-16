import { useQuery } from "@tanstack/react-query";
import { getDashboardKpis } from "../services/dashboardService";

export function useDashboardKpis(date: string, branchId: string | null) {
  return useQuery({
    queryKey: ["dashboard-kpis", date, branchId],
    queryFn: () => getDashboardKpis(date, branchId),
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}
