import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartSkeleton } from "../ui/ChartSkeleton";
import { WidgetError } from "@/reports/components/WidgetError";
import { EmptyState } from "@/reports/components/EmptyState";
import { Clock } from "lucide-react";
import type { HourlyPoint } from "@/reports/types/dashboard.types";

interface HourlyChartProps {
  data: HourlyPoint[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

function formatHour(h: number): string {
  const suffix = h >= 12 ? "pm" : "am";
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}${suffix}`;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover shadow-md p-3 text-xs flex flex-col gap-1">
      <p className="font-medium text-foreground">{label}</p>
      <p className="text-muted-foreground">
        {payload[0].value} venta{payload[0].value !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

export function HourlyChart({
  data,
  isLoading,
  isError,
  onRetry,
}: HourlyChartProps) {
  const max = Math.max(...(data ?? []).map((d) => d.sales_count), 0);

  const chartData = (data ?? []).map((d) => ({
    label: formatHour(d.hour_of_day),
    Ventas: d.sales_count,
    isPeak: d.sales_count === max && max > 0,
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-foreground">
          Actividad por hora
        </p>
        <p className="text-xs text-muted-foreground">
          Horas con mayor volumen de ventas hoy
        </p>
      </div>

      {isLoading && <ChartSkeleton height={200} />}

      {isError && !isLoading && (
        <WidgetError
          message="No se pudo cargar la actividad por hora"
          onRetry={onRetry}
        />
      )}

      {!isLoading && !isError && chartData.length === 0 && (
        <EmptyState
          icon={<Clock />}
          title="Sin actividad registrada hoy"
          description="Las ventas de hoy aparecerán aquí en tiempo real"
        />
      )}

      {!isLoading && !isError && chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={24}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Ventas" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell
                  key={`hourly-chart-cell-${i}`}
                  fill={entry.isPeak ? "#6366f1" : "hsl(var(--muted))"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
