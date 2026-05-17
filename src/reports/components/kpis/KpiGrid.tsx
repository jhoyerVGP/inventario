import {
  DollarSign,
  Wallet,
  ShoppingCart,
  ReceiptText,
  AlertTriangle,
  Package,
  TrendingUp,
  PackageX,
} from "lucide-react";
import { KpiCard } from "./KpiCard";
//import { KpiGridSkeleton } from "../ui/KpiSkeleton";
import { WidgetError } from "@/reports/components/WidgetError";
import type { DashboardKpis } from "@/reports/types/dashboard.types";

interface KpiGridProps {
  data: DashboardKpis | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

function formatCurrency(value: number): string {
  if (isNaN(value) || !isFinite(value)) return "Bs 0.00";
  return `Bs ${value.toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatNumber(value: number): string {
  if (isNaN(value) || !isFinite(value)) return "0";
  return value.toLocaleString("es-BO");
}

export function KpiGrid({ data, isLoading, isError, onRetry }: KpiGridProps) {
  // if (isLoading) return <KpiGridSkeleton />;

  if (isError) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <WidgetError
          message="No se pudieron cargar los indicadores"
          onRetry={onRetry}
        />
      </div>
    );
  }

  const kpis = [
    {
      title: "Ventas totales del día",
      value: formatCurrency(data?.total_sales ?? 0),
      trend: data?.sales_trend ?? "neutral",
      changePct: data?.sales_change_pct ?? 0,
      icon: <DollarSign className="w-4 h-4 text-primary" />,
      iconBg: "bg-primary/10",
    },
    {
      title: "Dinero recibido",
      value: formatCurrency(data?.cash_received ?? 0),
      trend: "neutral" as const,
      icon: <Wallet className="w-4 h-4 text-emerald-600" />,
      iconBg: "bg-emerald-500/10",
      subtitle: `Descuentos: ${formatCurrency(data?.total_discounts ?? 0)}`,
    },
    {
      title: "Ticket promedio",
      value: formatCurrency(data?.avg_ticket ?? 0),
      trend:
        (data?.ticket_change_pct ?? 0) > 0
          ? ("up" as const)
          : (data?.ticket_change_pct ?? 0) < 0
            ? ("down" as const)
            : ("neutral" as const),
      changePct: data?.ticket_change_pct ?? 0,
      icon: <ReceiptText className="w-4 h-4 text-violet-500" />,
      iconBg: "bg-violet-500/10",
    },
    {
      title: "Cantidad de ventas",
      value: formatNumber(data?.sales_count ?? 0),
      trend: "neutral" as const,
      icon: <ShoppingCart className="w-4 h-4 text-blue-500" />,
      iconBg: "bg-blue-500/10",
      changeLabel: "ventas completadas",
    },
    {
      title: "Deuda pendiente",
      value: formatCurrency(data?.total_debt ?? 0),
      trend:
        (data?.total_debt ?? 0) > 0 ? ("down" as const) : ("neutral" as const),
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
      iconBg: "bg-amber-500/10",
      changeLabel: (data?.total_debt ?? 0) > 0 ? "Deuda activa" : "Sin deuda",
    },
    {
      title: "Unidades vendidas",
      value: formatNumber(data?.total_units_sold ?? 0),
      trend: "neutral" as const,
      icon: <Package className="w-4 h-4 text-cyan-500" />,
      iconBg: "bg-cyan-500/10",
      changeLabel: "productos hoy",
    },
    {
      title: "Ganancia aproximada",
      value: formatCurrency(data?.approx_profit ?? 0),
      trend:
        (data?.approx_profit ?? 0) > 0 ? ("up" as const) : ("neutral" as const),
      icon: <TrendingUp className="w-4 h-4 text-emerald-500" />,
      iconBg: "bg-emerald-500/10",
      changeLabel: "margen estimado",
    },
    {
      title: "Productos con stock bajo",
      value: formatNumber(
        (data?.low_stock_count ?? 0) + (data?.out_of_stock_count ?? 0),
      ),
      trend:
        (data?.low_stock_count ?? 0) + (data?.out_of_stock_count ?? 0) > 0
          ? ("down" as const)
          : ("neutral" as const),
      icon: <PackageX className="w-4 h-4 text-red-500" />,
      iconBg: "bg-red-500/10",
      subtitle:
        (data?.out_of_stock_count ?? 0) > 0
          ? `${data?.out_of_stock_count} agotados`
          : undefined,
      changeLabel:
        (data?.low_stock_count ?? 0) + (data?.out_of_stock_count ?? 0) === 0
          ? "Todo en orden"
          : "Requieren atención",
    },
  ] as const;

  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <KpiCard key={`kpi-card-${kpi.title}`} {...kpi} />
      ))}
    </div>
  );
}
