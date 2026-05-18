import { format } from "date-fns";
import { es } from "date-fns/locale";
import { RefreshCw, CalendarDays, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DateRangePreset } from "@/reports/types/filters.types";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  nameBranch: string | null;
  preset: DateRangePreset;
  onPresetChange: (p: DateRangePreset) => void;
  fromDate: string;
  toDate: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const PRESETS: { value: DateRangePreset; label: string }[] = [
  { value: "today", label: "Hoy" },
  { value: "yesterday", label: "Ayer" },
  { value: "7d", label: "7 días" },
  { value: "30d", label: "30 días" },
];

export function DashboardHeader({
  nameBranch,
  preset,
  onPresetChange,
  fromDate,
  toDate,
  onRefresh,
  isRefreshing,
}: DashboardHeaderProps) {
  const today = format(new Date(), "EEEE d 'de' MMMM, yyyy", { locale: es });
  const todayCap = today.charAt(0).toUpperCase() + today.slice(1);

  const rangeLabel =
    fromDate === toDate
      ? format(new Date(fromDate + "T12:00:00"), "d MMM yyyy", { locale: es })
      : `${format(new Date(fromDate + "T12:00:00"), "d MMM", { locale: es })} – ${format(new Date(toDate + "T12:00:00"), "d MMM yyyy", { locale: es })}`;

  return (
    <div className="flex flex-col gap-3">
      {/* Top row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1 lg:gap-2">
          <h1 className="text-xl font-semibold text-foreground lg:text-3xl">
            Resumen operativo
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">{todayCap}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Branch badge */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-lg px-3 py-1.5">
            <Store className="w-3.5 h-3.5" />
            <span>{nameBranch ?? "Todas las sucursales"}</span>
          </div>

          {/* Date range label */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-lg px-3 py-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>{rangeLabel}</span>
          </div>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-xs border border-border rounded-lg px-3 py-1.5 hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin")}
            />
            Actualizar
          </button>
        </div>
      </div>

      {/* Preset pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {PRESETS.map((p) => (
          <Button
            className="text-xs lg:text-sm rounded-lg border transition-colors"
            key={`dashboard-preset-${p.value}`}
            variant={preset === p.value ? "default" : "outline"}
            onClick={() => onPresetChange(p.value)}
            size="sm"
          >
            {p.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
