import { useQuery } from "@tanstack/react-query";
import {
  getSalesHistoryDays,
  getSalesHistoryMonths,
} from "../services/dashboardService";

export function useSalesHistoryDays(
  from: string,
  to: string,
  branchId: string | null,
) {
  return useQuery({
    queryKey: ["sales-history-days", from, to, branchId],
    queryFn: () => getSalesHistoryDays(from, to, branchId),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useSalesHistoryMonths(
  from: string,
  to: string,
  branchId: string | null,
) {
  return useQuery({
    queryKey: ["sales-history-months", from, to, branchId],
    queryFn: () => getSalesHistoryMonths(from, to, branchId),
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
}
