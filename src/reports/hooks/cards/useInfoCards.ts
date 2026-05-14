//import del hook de cards diario
import { useRepDay } from "@/reports/hooks/cards/useRepDay";
//hook para traer las deudas
import { useGetDebt } from "@/reports/hooks/cards/useGetDebt";
import { useGetLowStockProducts } from "@/hooks/usePurchase";
import { useMemo } from "react";

export const useInfoCards = ({
  currentBranch,
}: {
  currentBranch: string | null;
}) => {
  // Memorizar la fecha para que no cambie en cada render
  // Obtener fecha en formato YYYY-MM-DD (sin hora)
  const reportDate = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);
  // Usar el hook para obtener el resumen diario
  const { data: summaryData } = useRepDay({
    report_date: reportDate, // "2024-12-27"
    branch_id: currentBranch,
  });
  //usamos el hook para traer las deudas pendientes
  const { data: debtData, isError, isLoading } = useGetDebt(currentBranch);
  
  //hook para traer productos con stock bajo
  const { data: lowStockData } = useGetLowStockProducts(currentBranch || "");

  //data que se pasa a las cards
  const data = useMemo(() => {
    // Contar productos agotados
    const outOfStockCount = lowStockData?.filter((p) => p.stock === 0).length || 0;
    // Contar productos con stock bajo
    const lowStockCount = lowStockData?.length || 0;

    return {
      cash_received_amount: summaryData?.cash_received_amount ?? 0,
      total_pending_debt: debtData?.total_pending_debt ?? 0,
      completed_sales_amount: summaryData?.completed_sales_amount ?? 0,
      total_discounts: summaryData?.total_discounts ?? 0,
      total_sales_count: summaryData?.total_sales_count ?? 0,
      low_stock_count: lowStockCount,
      out_of_stock_count: outOfStockCount,
    };
  }, [summaryData, debtData, lowStockData]);

  return { data, isError, isLoading };
};
