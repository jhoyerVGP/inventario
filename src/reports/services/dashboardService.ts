import { supabase } from "@/api/supabaseClient";
import type {
  DashboardKpis,
  SalesHistoryPoint,
  HourlyPoint,
  PaymentMethod,
} from "../types/dashboard.types";

export const getDashboardKpis = async (
  date: string,
  branchId: string | null,
): Promise<DashboardKpis> => {
  const { data, error } = await supabase
    .rpc("dashboard_kpis", { p_date: date, p_branch_id: branchId })
    .single();
  if (error) throw new Error(error.message);
  return data as DashboardKpis;
};

export const getSalesHistoryDays = async (
  fromDate: string,
  toDate: string,
  branchId: string | null,
): Promise<SalesHistoryPoint[]> => {
  const { data, error } = await supabase.rpc("report_sales_history", {
    from_date: fromDate,
    to_date: toDate,
    branch_id: branchId,
  });
  if (error) throw new Error(error.message);
  return (data ?? []) as SalesHistoryPoint[];
};

export const getSalesHistoryMonths = async (
  fromDate: string,
  toDate: string,
  branchId: string | null,
): Promise<SalesHistoryPoint[]> => {
  const { data, error } = await supabase.rpc("report_sales_history_month", {
    from_date: fromDate,
    to_date: toDate,
    branch_id: branchId,
  });
  if (error) throw new Error(error.message);
  return (data ?? []) as SalesHistoryPoint[];
};

export const getSalesByHour = async (
  date: string,
  branchId: string | null,
): Promise<HourlyPoint[]> => {
  const { data, error } = await supabase.rpc("report_sales_by_hour", {
    p_date: date,
    p_branch_id: branchId,
  });
  if (error) throw new Error(error.message);
  return (data ?? []) as HourlyPoint[];
};

export const getPaymentMethods = async (
  fromDate: string,
  toDate: string,
  branchId: string | null,
): Promise<PaymentMethod[]> => {
  const { data, error } = await supabase.rpc("report_payment_methods", {
    p_from_date: fromDate,
    p_to_date: toDate,
    p_branch_id: branchId,
  });
  if (error) throw new Error(error.message);
  return (data ?? []) as PaymentMethod[];
};

export const getPendingDebt = async (
  branchId: string | null,
): Promise<number> => {
  const { data, error } = await supabase
    .rpc("report_total_pending_debt", { branch_id: branchId })
    .single();
  if (error) throw new Error(error.message);
  return (data as { total_pending_debt: number })?.total_pending_debt ?? 0;
};
