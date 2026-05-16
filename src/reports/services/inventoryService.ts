import { supabase } from "@/api/supabaseClient";
import type { LowStockProduct } from "../types/inventory.types";

export const getLowStockProducts = async (
  branchId: string | null,
  limit = 20,
): Promise<LowStockProduct[]> => {
  const { data, error } = await supabase.rpc("report_low_stock_products", {
    p_branch_id: branchId,
    p_limit: limit,
  });
  if (error) throw new Error(error.message);
  return (data ?? []) as LowStockProduct[];
};
