//import { TableSkeleton } from "@/reports/components/";
import { WidgetError } from "@/reports/components/WidgetError";
import { EmptyState } from "@/reports/components/EmptyState";
import { Trophy, Store } from "lucide-react";
import type {
  TopProduct,
  TopBranch,
  TopProfitProduct,
} from "@/reports/types/rankings.types";

function formatCurrency(v: number) {
  return `Bs ${v.toLocaleString("es-BO", { minimumFractionDigits: 2 })}`;
}

// ─── Top Products ────────────────────────────────────────────────────────────

interface TopProductsProps {
  data: TopProduct[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function TopProductsList({
  data,
  isLoading,
  isError,
  onRetry,
}: TopProductsProps) {
  const items = data ?? [];
  const maxAmount = Math.max(...items.map((d) => d.amount), 1);

  return (
    <div className="rounded-xl border border-border bg-card flex flex-col">
      <div className="px-5 py-4 border-b border-border">
        <p className="text-sm font-semibold text-foreground">
          Productos más vendidos
        </p>
        <p className="text-xs text-muted-foreground">Por unidades vendidas</p>
      </div>

      {/* {isLoading && <TableSkeleton rows={5} />} */}

      {isError && !isLoading && (
        <WidgetError
          message="No se pudieron cargar los productos"
          onRetry={onRetry}
        />
      )}

      {!isLoading && !isError && items.length === 0 && (
        <EmptyState
          icon={<Trophy />}
          title="Sin productos vendidos aún"
          description="Los productos más vendidos aparecerán aquí"
        />
      )}

      {!isLoading && !isError && items.length > 0 && (
        <div className="divide-y divide-border">
          {items.map((item, i) => (
            <div
              key={`top-products-item-${item.id}`}
              className="flex items-center gap-3 px-5 py-3"
            >
              <span className="text-xs font-medium text-muted-foreground w-5 text-center">
                {i + 1}
              </span>
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {item.title.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {item.title}
                </p>
                {item.subtitle && (
                  <p className="text-xs text-muted-foreground truncate">
                    {item.subtitle}
                  </p>
                )}
                <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all"
                    style={{ width: `${(item.amount / maxAmount) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-semibold text-foreground">
                  {item.amount} uds
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(item.revenue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Top Branches ────────────────────────────────────────────────────────────

interface TopBranchesProps {
  data: TopBranch[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function TopBranchesList({
  data,
  isLoading,
  isError,
  onRetry,
}: TopBranchesProps) {
  const items = data ?? [];
  const maxAmount = Math.max(...items.map((d) => d.amount), 1);

  return (
    <div className="rounded-xl border border-border bg-card flex flex-col">
      <div className="px-5 py-4 border-b border-border">
        <p className="text-sm font-semibold text-foreground">
          Sucursales con más ventas
        </p>
        <p className="text-xs text-muted-foreground">Por monto total vendido</p>
      </div>

      {/* {isLoading && <TableSkeleton rows={5} />} */}

      {isError && !isLoading && (
        <WidgetError
          message="No se pudieron cargar las sucursales"
          onRetry={onRetry}
        />
      )}

      {!isLoading && !isError && items.length === 0 && (
        <EmptyState
          icon={<Store />}
          title="Sin datos de sucursales"
          description="Las sucursales activas aparecerán aquí"
        />
      )}

      {!isLoading && !isError && items.length > 0 && (
        <div className="divide-y divide-border">
          {items.map((item, i) => (
            <div
              key={`top-branches-item-sec-1-${item.id}`}
              className="flex items-center gap-3 px-5 py-3"
            >
              <span className="text-xs font-medium text-muted-foreground w-5 text-center">
                {i + 1}
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Store className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {item.title}
                </p>
                {item.subtitle && (
                  <p className="text-xs text-muted-foreground truncate">
                    {item.subtitle}
                  </p>
                )}
                <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${(item.amount / maxAmount) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-semibold text-foreground">
                  {formatCurrency(item.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.sales_count} ventas
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Top Profit Products ──────────────────────────────────────────────────────

interface TopProfitProps {
  data: TopProfitProduct[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function TopProfitList({
  data,
  isLoading,
  isError,
  onRetry,
}: TopProfitProps) {
  const items = data ?? [];
  const maxProfit = Math.max(...items.map((d) => d.profit), 1);

  return (
    <div className="rounded-xl border border-border bg-card flex flex-col">
      <div className="px-5 py-4 border-b border-border">
        <p className="text-sm font-semibold text-foreground">
          Productos más rentables
        </p>
        <p className="text-xs text-muted-foreground">Por ganancia generada</p>
      </div>

      {/* {isLoading && <TableSkeleton rows={5} />} */}

      {isError && !isLoading && (
        <WidgetError
          message="No se pudieron cargar los productos"
          onRetry={onRetry}
        />
      )}

      {!isLoading && !isError && items.length === 0 && (
        <EmptyState
          icon={<Trophy />}
          title="Sin datos de rentabilidad"
          description="Agrega costo a los productos para ver esta sección"
        />
      )}

      {!isLoading && !isError && items.length > 0 && (
        <div className="divide-y divide-border">
          {items.map((item, i) => (
            <div
              key={`top-profit-item-sec-3-${item.id}`}
              className="flex items-center gap-3 px-5 py-3"
            >
              <span className="text-xs font-medium text-muted-foreground w-5 text-center">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {item.title}
                </p>
                <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-violet-500 transition-all"
                    style={{ width: `${(item.profit / maxProfit) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-semibold text-foreground">
                  {formatCurrency(item.profit)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.margin_pct}% margen
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
