import type { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Trend = "up" | "down" | "neutral" | "new";

interface KpiCardProps {
  title: string;
  value: string;
  trend?: Trend;
  changePct?: number;
  changeLabel?: string;
  icon: ReactNode;
  iconBg?: string;
  subtitle?: string;
}

function formatChangePct(trend: Trend, pct: number): string {
  if (trend === "new") return "Nuevo movimiento";
  if (trend === "neutral") return "Sin cambios";
  const sign = trend === "up" ? "+" : "";
  const safe = isFinite(pct) && !isNaN(pct) ? pct : 0;
  return `${sign}${safe.toFixed(1)}%`;
}

const trendConfig: Record<
  Trend,
  { icon: ReactNode; className: string; dotClass: string }
> = {
  up: {
    icon: <TrendingUp className="w-3 h-3" />,
    className: "text-emerald-600 dark:text-emerald-400",
    dotClass: "bg-emerald-500",
  },
  down: {
    icon: <TrendingDown className="w-3 h-3" />,
    className: "text-red-500 dark:text-red-400",
    dotClass: "bg-red-500",
  },
  neutral: {
    icon: <Minus className="w-3 h-3" />,
    className: "text-muted-foreground",
    dotClass: "bg-muted-foreground",
  },
  new: {
    icon: <Sparkles className="w-3 h-3" />,
    className: "text-blue-500 dark:text-blue-400",
    dotClass: "bg-blue-500",
  },
};

export function KpiCard({
  title,
  value,
  trend = "neutral",
  changePct = 0,
  changeLabel,
  icon,
  iconBg = "bg-primary/10",
  subtitle,
}: KpiCardProps) {
  const cfg = trendConfig[trend];

  return (
    <div className="flex h-full min-w-0 flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm sm:gap-3 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 flex-1 text-xs font-medium leading-snug text-muted-foreground line-clamp-2">
          {title}
        </p>
        <div
          className={cn(
            "shrink-0 rounded-lg p-1.5 sm:p-2 [&_svg]:size-3.5 sm:[&_svg]:size-4",
            iconBg,
          )}
        >
          {icon}
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-xl font-semibold tracking-tight text-foreground break-words sm:text-2xl">
          {value}
        </p>
        {subtitle && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      <div
        className={cn(
          "mt-auto flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0.5 text-xs font-medium",
          cfg.className,
        )}
      >
        {cfg.icon}
        <span>{changeLabel ?? formatChangePct(trend, changePct)}</span>
        {trend !== "new" && trend !== "neutral" && (
          <span className="text-muted-foreground font-normal ml-0.5">
            vs ayer
          </span>
        )}
      </div>
    </div>
  );
}
