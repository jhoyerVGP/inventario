import { useQuery } from "@tanstack/react-query";
import { getPendingDebt } from "../services/dashboardService";

export function usePendingDebt(branchId: string | null) {
  return useQuery({
    queryKey: ["pending-debt", branchId],
    queryFn: () => getPendingDebt(branchId),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
