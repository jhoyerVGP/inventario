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
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground leading-tight max-w-[70%]">
          {title}
        </p>
        <div className={cn("p-2 rounded-lg", iconBg)}>{icon}</div>
      </div>

      <div>
        <p className="text-2xl font-semibold text-foreground tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>

      <div
        className={cn(
          "flex items-center gap-1 text-xs font-medium",
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
