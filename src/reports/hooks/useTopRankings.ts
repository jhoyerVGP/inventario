import { useQuery } from "@tanstack/react-query";
import {
  getTopProducts,
  getTopBranches,
  getTopProfitProducts,
} from "../services/rankingsService";

export function useTopProducts(
  branchId: string | null,
  fromDate: string,
  toDate: string,
  limit = 5,
) {
  return useQuery({
    queryKey: ["top-products", branchId, fromDate, toDate, limit],
    queryFn: () => getTopProducts(branchId, limit, fromDate, toDate),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useTopBranches(fromDate: string, toDate: string, limit = 5) {
  return useQuery({
    queryKey: ["top-branches", fromDate, toDate, limit],
    queryFn: () => getTopBranches(limit, fromDate, toDate),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useTopProfitProducts(
  branchId: string | null,
  fromDate: string,
  toDate: string,
  limit = 5,
) {
  return useQuery({
    queryKey: ["top-profit-products", branchId, fromDate, toDate, limit],
    queryFn: () => getTopProfitProducts(branchId, limit, fromDate, toDate),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
