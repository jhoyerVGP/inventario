import { AlertTriangle, PackageX, Package, DollarSign } from "lucide-react";
import { WidgetError } from "@/reports/components/WidgetError";
import { EmptyState } from "@/reports/components/EmptyState";
import { TableSkeleton } from "../ui/ChartSkeleton";
import { cn } from "@/lib/utils";
import type { LowStockProduct } from "@/reports/types/inventory.types";

interface AlertsPanelProps {
  lowStock: LowStockProduct[] | undefined;
  totalDebt: number;
  isLoadingStock: boolean;
  isErrorStock: boolean;
  onRetryStock: () => void;
}

const severityConfig = {
  critical: {
    icon: <PackageX className="w-4 h-4 text-red-500" />,
    badge: "bg-red-500/10 text-red-600 dark:text-red-400",
    label: "Agotado",
    bar: "bg-red-500",
  },
  low: {
    icon: <Package className="w-4 h-4 text-amber-500" />,
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    label: "Stock bajo",
    bar: "bg-amber-500",
  },
} as const;

export function AlertsPanel({
  lowStock,
  totalDebt,
  isLoadingStock,
  isErrorStock,
  onRetryStock,
}: AlertsPanelProps) {
  const items = lowStock ?? [];
  const hasAlerts = items.length > 0 || totalDebt > 0;

  return (
    <div className="rounded-xl border border-border bg-card flex flex-col">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Alertas del sistema
          </p>
          <p className="text-xs text-muted-foreground">Requieren tu atención</p>
        </div>
        {hasAlerts && (
          <span className="text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
            {items.length + (totalDebt > 0 ? 1 : 0)} alertas
          </span>
        )}
      </div>

      {/* Alerta de deuda */}
      {totalDebt > 0 && (
        <div className="px-5 py-3 border-b border-border flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground">
              Deuda pendiente acumulada
            </p>
            <p className="text-xs text-muted-foreground">
              Bs{" "}
              {totalDebt.toLocaleString("es-BO", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <span className="text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full flex-shrink-0">
            Pendiente
          </span>
        </div>
      )}

      {/* Alertas de stock */}
      {isLoadingStock && <TableSkeleton rows={3} />}

      {isErrorStock && !isLoadingStock && (
        <WidgetError
          message="No se pudieron cargar las alertas de inventario"
          onRetry={onRetryStock}
        />
      )}

      {!isLoadingStock &&
        !isErrorStock &&
        items.length === 0 &&
        totalDebt === 0 && (
          <EmptyState
            icon={<AlertTriangle />}
            title="Todo en orden"
            description="No hay alertas activas en este momento"
          />
        )}

      {!isLoadingStock && !isErrorStock && items.length > 0 && (
        <div className="divide-y divide-border max-h-80 overflow-y-auto">
          {items.map((item, index) => {
            const cfg = severityConfig[item.severity];
            return (
              <div
                key={`sectionAlertPanel-${item.product_id}-${item.severity}-${index}`}
                className="flex items-center gap-3 px-5 py-3"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    item.severity === "critical"
                      ? "bg-red-500/10"
                      : "bg-amber-500/10",
                  )}
                >
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {item.product_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.current_stock === 0
                      ? `Sin stock — ${item.branch_name}`
                      : `${item.current_stock} uds — mín. ${item.min_stock} · ${item.branch_name}`}
                  </p>
                  {item.current_stock > 0 && (
                    <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", cfg.bar)}
                        style={{
                          width: `${Math.min((item.current_stock / item.min_stock) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0",
                    cfg.badge,
                  )}
                >
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
