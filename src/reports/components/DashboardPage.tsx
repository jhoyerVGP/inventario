import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { format, subMonths } from "date-fns";

// Context
import { useBranch } from "@/context/BranchContext";

// Filters hook
import { useDashboardFilters } from "@/reports/hooks/useDashboardFilters";

// Data hooks
import { useDashboardKpis } from "@/reports/hooks/useDashboardKpis";
import {
  useSalesHistoryDays,
  useSalesHistoryMonths,
} from "@/reports/hooks/useSalesHistory";
import {
  useTopProducts,
  useTopBranches,
  useTopProfitProducts,
} from "@/reports/hooks/useTopRankings";
import { useInventoryAlerts } from "@/reports/hooks/useInventoryAlerts";
import { usePaymentMethods } from "@/reports/hooks/usePaymentMethods";
import { useSalesByHour } from "@/reports/hooks/useSalesByHour";
import { usePendingDebt } from "@/reports/hooks/usePendingDebt";

// Components
import { DashboardHeader } from "./DashboardHeader";
import { KpiGrid } from "./kpis/KpiGrid";
import { SalesChart } from "./charts/SalesChart";
import { PaymentChart } from "./charts/PaymentChart";
import { HourlyChart } from "./charts/HourlyChart";
import {
  TopProductsList,
  TopBranchesList,
  TopProfitList,
} from "./rankings/TopRankings";
import { AlertsPanel } from "./alerts/AlertsPanel";

export default function DashboardPage() {
  const { currentBranch, nameCBranch } = useBranch();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartMode, setChartMode] = useState<"days" | "months">("days");

  const { preset, setPreset, fromDate, toDate } = useDashboardFilters();

  // La sucursal viene del contexto global — el BranchSelector ya existe en el layout
  //const branchId = currentBranch;
  const branchId = currentBranch && currentBranch !== "" ? currentBranch : null;
  const today = format(new Date(), "yyyy-MM-dd");

  // ── KPIs (siempre del día de hoy) ──────────────────────────────────────────
  const kpisQuery = useDashboardKpis(today, branchId);

  // ── Historial de ventas ────────────────────────────────────────────────────
  const salesDaysQuery = useSalesHistoryDays(fromDate, toDate, branchId);
  //const salesMonthsQuery = useSalesHistoryMonths(fromDate, toDate, branchId);
  // En tu DashboardPage:
  const salesMonthsQuery = useSalesHistoryMonths(
    // En lugar de fromDate del filtro común, le mandas por ejemplo el inicio de hace 6 meses
    format(subMonths(new Date(), 6), "yyyy-MM-dd"),
    today,
    branchId,
  );

/*   console.log("salesDays", {
    status: salesDaysQuery.status,
    isLoading: salesDaysQuery.isLoading,
    isError: salesDaysQuery.isError,
    error: salesDaysQuery.error,
    data: salesDaysQuery.data,
  });
  console.log("salesMonths", {
    status: salesMonthsQuery.status,
    isLoading: salesMonthsQuery.isLoading,
    isError: salesMonthsQuery.isError,
    error: salesMonthsQuery.error,
    data: salesMonthsQuery.data,
  }); */
  const salesQuery = chartMode === "days" ? salesDaysQuery : salesMonthsQuery;

  // ── Rankings ───────────────────────────────────────────────────────────────
  const topProductsQuery = useTopProducts(branchId, fromDate, toDate);
  const topBranchesQuery = useTopBranches(fromDate, toDate);
  const topProfitQuery = useTopProfitProducts(branchId, fromDate, toDate);

  // ── Alertas de inventario ──────────────────────────────────────────────────
  const inventoryQuery = useInventoryAlerts(branchId);

  // ── Métodos de pago ────────────────────────────────────────────────────────
  const paymentsQuery = usePaymentMethods(fromDate, toDate, branchId);

  // ── Actividad por hora (solo hoy) ──────────────────────────────────────────
  const hourlyQuery = useSalesByHour(today, branchId);

  // ── Deuda pendiente ────────────────────────────────────────────────────────
  const debtQuery = usePendingDebt(branchId);

  // ── Refresh global ─────────────────────────────────────────────────────────
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
    await queryClient.invalidateQueries({ queryKey: ["sales-history-days"] });
    await queryClient.invalidateQueries({ queryKey: ["sales-history-months"] });
    await queryClient.invalidateQueries({ queryKey: ["top-products"] });
    await queryClient.invalidateQueries({ queryKey: ["top-branches"] });
    await queryClient.invalidateQueries({ queryKey: ["top-profit-products"] });
    await queryClient.invalidateQueries({ queryKey: ["inventory-alerts"] });
    await queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    await queryClient.invalidateQueries({ queryKey: ["sales-by-hour"] });
    await queryClient.invalidateQueries({ queryKey: ["pending-debt"] });
    setIsRefreshing(false);
  };

 /*  console.log("datos de venta", {
    status: salesQuery.status,
    isLoading: salesQuery.isLoading,
    isError: salesQuery.isError,
    error: salesQuery.error,
    data: salesQuery.data,
  }); */

  return (
    <div className="min-h-full h-full p-4 w-full bg-background overflow-y-auto">
      <div className="max-w-7xl mx-auto flex flex-col gap-5">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <DashboardHeader
          nameBranch={nameCBranch}
          preset={preset}
          onPresetChange={setPreset}
          fromDate={fromDate}
          toDate={toDate}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {/* ── KPIs ────────────────────────────────────────────────────────── */}
        <KpiGrid
          data={kpisQuery.data}
          isLoading={kpisQuery.isLoading}
          isError={kpisQuery.isError}
          onRetry={() => kpisQuery.refetch()}
        />

        {/* ── Gráfico de ventas (ocupa todo el ancho) ──────────────────────── */}
        <SalesChart
          data={salesQuery.data}
          isLoading={salesQuery.isLoading}
          isError={salesQuery.isError}
          onRetry={() => salesQuery.refetch()}
          mode={chartMode}
          onModeChange={setChartMode}
          preset={preset}
        />

        {/* ── Fila: Métodos de pago + Actividad por hora ───────────────────── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <PaymentChart
            data={paymentsQuery.data}
            isLoading={paymentsQuery.isLoading}
            isError={paymentsQuery.isError}
            onRetry={() => paymentsQuery.refetch()}
          />
          <HourlyChart
            data={hourlyQuery.data}
            isLoading={hourlyQuery.isLoading}
            isError={hourlyQuery.isError}
            onRetry={() => hourlyQuery.refetch()}
          />
        </div>

        {/* ── Rankings: Productos + Sucursales + Rentabilidad ──────────────── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <TopProductsList
            data={topProductsQuery.data}
            isLoading={topProductsQuery.isLoading}
            isError={topProductsQuery.isError}
            onRetry={() => topProductsQuery.refetch()}
          />
          <TopBranchesList
            data={topBranchesQuery.data}
            isLoading={topBranchesQuery.isLoading}
            isError={topBranchesQuery.isError}
            onRetry={() => topBranchesQuery.refetch()}
          />
          <TopProfitList
            data={topProfitQuery.data}
            isLoading={topProfitQuery.isLoading}
            isError={topProfitQuery.isError}
            onRetry={() => topProfitQuery.refetch()}
          />
        </div>

        {/* ── Alertas del sistema ───────────────────────────────────────────── */}
        <AlertsPanel
          lowStock={inventoryQuery.data}
          totalDebt={debtQuery.data ?? 0}
          isLoadingStock={inventoryQuery.isLoading}
          isErrorStock={inventoryQuery.isError}
          onRetryStock={() => inventoryQuery.refetch()}
        />
      </div>
    </div>
  );
}
