import { useQuery } from "@tanstack/react-query";
import { getLowStockProducts } from "../services/inventoryService";

export function useInventoryAlerts(branchId: string | null, limit = 20) {
  return useQuery({
    queryKey: ["inventory-alerts", branchId, limit],
    queryFn: () => getLowStockProducts(branchId, limit),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
