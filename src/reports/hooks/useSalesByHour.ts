import { useQuery } from "@tanstack/react-query";
import { getSalesByHour } from "../services/dashboardService";

export function useSalesByHour(date: string, branchId: string | null) {
  return useQuery({
    queryKey: ["sales-by-hour", date, branchId],
    queryFn: () => getSalesByHour(date, branchId),
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}
