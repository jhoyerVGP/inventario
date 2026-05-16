import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChartSkeleton } from "../ui/ChartSkeleton";
import { WidgetError } from "@/reports/components/WidgetError";
import { EmptyState } from "@/reports/components/EmptyState";
import { CreditCard } from "lucide-react";
import type { PaymentMethod } from "@/reports/types/dashboard.types";

interface PaymentChartProps {
  data: PaymentMethod[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#3b82f6",
  "#ec4899",
  "#8b5cf6",
];

const METHOD_LABELS: Record<string, string> = {
  CASH: "Efectivo",
  CARD: "Tarjeta",
  QR: "QR",
  TRANSFER: "Transferencia",
  OTROS: "Otros",
};

function formatCurrency(v: number) {
  return `Bs ${v.toLocaleString("es-BO", { minimumFractionDigits: 2 })}`;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: PaymentMethod & { label: string; color: string };
  }>;
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-popover shadow-md p-3 text-xs flex flex-col gap-1">
      <p className="font-medium text-foreground">{d.label}</p>
      <p className="text-muted-foreground">{formatCurrency(d.total_amount)}</p>
      <p className="text-muted-foreground">{d.percentage}% del total</p>
    </div>
  );
};

export function PaymentChart({
  data,
  isLoading,
  isError,
  onRetry,
}: PaymentChartProps) {
  const chartData = (data ?? []).map((d, i) => ({
    ...d,
    label: METHOD_LABELS[d.method] ?? d.method,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <div>
        <p className="text-sm font-semibold text-foreground">Métodos de pago</p>
        <p className="text-xs text-muted-foreground">
          Distribución de ingresos por método
        </p>
      </div>

      {isLoading && <ChartSkeleton height={200} />}

      {isError && !isLoading && (
        <WidgetError
          message="No se pudieron cargar los métodos de pago"
          onRetry={onRetry}
        />
      )}

      {!isLoading && !isError && chartData.length === 0 && (
        <EmptyState
          icon={<CreditCard />}
          title="Sin pagos registrados"
          description="No hay pagos en el período seleccionado"
        />
      )}

      {!isLoading && !isError && chartData.length > 0 && (
        <div className="flex flex-col gap-3">
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="total_amount"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                strokeWidth={0}
              >
                {chartData.map((entry, i) => (
                  <Cell key={`payment-chart-cell-RC-${i}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex flex-col gap-2">
            {chartData.map((d) => (
              <div
                key={`payment-chart-legend-CD-${d.method}`}
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: d.color }}
                  />
                  {d.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{d.percentage}%</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(d.total_amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
