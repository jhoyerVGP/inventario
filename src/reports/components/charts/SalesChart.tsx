import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ChartSkeleton } from "../ui/ChartSkeleton";
import { WidgetError } from "@/reports/components/WidgetError";
import { EmptyState } from "@/reports/components/EmptyState";
import { BarChart2 } from "lucide-react";
import type { SalesHistoryPoint } from "@/reports/types/dashboard.types";
import type { DateRangePreset } from "@/reports/types/filters.types";
import { cn } from "@/lib/utils";

interface SalesChartProps {
  data: SalesHistoryPoint[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  mode: "days" | "months";
  onModeChange: (mode: "days" | "months") => void;
  preset: DateRangePreset;
}

function formatLabel(dateStr: string, mode: "days" | "months"): string {
  try {
    const d = parseISO(dateStr);
    if (mode === "months") return format(d, "MMM yy", { locale: es });
    return format(d, "dd MMM", { locale: es });
  } catch {
    return dateStr;
  }
}

function formatTooltipValue(value: number): string {
  return `Bs ${value.toLocaleString("es-BO", { minimumFractionDigits: 2 })}`;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover shadow-md p-3 text-xs flex flex-col gap-1.5">
      <p className="font-medium text-foreground">{label}</p>
      {payload.map((p) => (
        <div
          key={`sales-chart-tooltip-${p.name}`}
          className="flex items-center gap-2"
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: p.color }}
          />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium text-foreground">
            {formatTooltipValue(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export function SalesChart({
  data,
  isLoading,
  isError,
  onRetry,
  mode,
  onModeChange,
}: SalesChartProps) {
  const chartData = (data ?? []).map((d) => ({
    label: formatLabel(d.sale_date, mode),
    Ventas: d.total_sold,
    Cobrado: d.total_cash,
    Deuda: d.total_debt,
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Historial de ventas
          </p>
          <p className="text-xs text-muted-foreground">
            Ventas, cobros y deuda generada
          </p>
        </div>
        <div className="flex items-center rounded-lg border border-border overflow-hidden text-xs">
          <button
            onClick={() => onModeChange("days")}
            className={cn(
              "px-3 py-1.5 transition-colors",
              mode === "days"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            Por día
          </button>
          <button
            onClick={() => onModeChange("months")}
            className={cn(
              "px-3 py-1.5 transition-colors",
              mode === "months"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            Por mes
          </button>
        </div>
      </div>

      {isLoading && <ChartSkeleton height={240} />}

      {isError && !isLoading && (
        <WidgetError
          message="No se pudo cargar el historial de ventas"
          onRetry={onRetry}
        />
      )}

      {!isLoading && !isError && chartData.length === 0 && (
        <EmptyState
          icon={<BarChart2 />}
          title="Sin datos para este período"
          description="No hay ventas registradas en el rango seleccionado"
        />
      )}

      {!isLoading && !isError && chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradVentas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradCobrado" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              width={36}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="Ventas"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#gradVentas)"
              dot={false}
              activeDot={{ r: 4, fill: "#6366f1" }}
            />
            <Area
              type="monotone"
              dataKey="Cobrado"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#gradCobrado)"
              dot={false}
              activeDot={{ r: 4, fill: "#10b981" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}

      {/* Leyenda */}
      {!isLoading && !isError && chartData.length > 0 && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            Ventas totales
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Cobrado
          </span>
        </div>
      )}
    </div>
  );
}
