import { supabase } from "@/api/supabaseClient";
import type {
  TopProduct,
  TopBranch,
  TopProfitProduct,
} from "../types/rankings.types";

export const getTopProducts = async (
  branchId: string | null,
  limit = 5,
  fromDate?: string,
  toDate?: string,
): Promise<TopProduct[]> => {
  const { data, error } = await supabase.rpc("get_top_selling_products", {
    p_branch_id: branchId,
    p_limit: limit,
    p_from_date: fromDate ?? null,
    p_to_date: toDate ?? null,
  });
  if (error) throw new Error(error.message);
  return (data ?? []) as TopProduct[];
};

export const getTopBranches = async (
  limit = 5,
  fromDate?: string,
  toDate?: string,
): Promise<TopBranch[]> => {
  const { data, error } = await supabase.rpc("get_top_branches_by_revenue", {
    p_limit: limit,
    p_from_date: fromDate ?? null,
    p_to_date: toDate ?? null,
  });
  if (error) throw new Error(error.message);
  return (data ?? []) as TopBranch[];
};

export const getTopProfitProducts = async (
  branchId: string | null,
  limit = 5,
  fromDate?: string,
  toDate?: string,
): Promise<TopProfitProduct[]> => {
  const { data, error } = await supabase.rpc("report_top_profit_products", {
    p_branch_id: branchId,
    p_limit: limit,
    p_from_date: fromDate ?? null,
    p_to_date: toDate ?? null,
  });
  if (error) throw new Error(error.message);
  return (data ?? []) as TopProfitProduct[];
};
