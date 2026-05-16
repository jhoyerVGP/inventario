import { useQuery } from "@tanstack/react-query";
import { getPaymentMethods } from "../services/dashboardService";

export function usePaymentMethods(
  fromDate: string,
  toDate: string,
  branchId: string | null,
) {
  return useQuery({
    queryKey: ["payment-methods", fromDate, toDate, branchId],
    queryFn: () => getPaymentMethods(fromDate, toDate, branchId),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
