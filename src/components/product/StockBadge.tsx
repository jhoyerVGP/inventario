import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StockBadgeProps {
  currentStock: number;
  minimumStock?: number;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export const StockBadge = ({
  currentStock,
  minimumStock = 0,
  size = "md",
  showIcon = true,
}: StockBadgeProps) => {
  const isLow = currentStock <= minimumStock;
  const isOutOfStock = currentStock === 0;

  if (isOutOfStock) {
    return (
      <Badge
        variant="destructive"
        className={`gap-1 ${size === "sm" ? "text-xs px-2 py-0.5" : ""}`}
      >
        {showIcon && <AlertCircle className="w-3 h-3" />}
        Agotado
      </Badge>
    );
  }

  if (isLow) {
    return (
      <Badge
        className={`gap-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-100 ${
          size === "sm" ? "text-xs px-2 py-0.5" : ""
        }`}
      >
        {showIcon && <AlertCircle className="w-3 h-3" />}
        Stock Bajo
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className={`gap-1 ${size === "sm" ? "text-xs px-2 py-0.5" : ""}`}
    >
      {showIcon && <CheckCircle2 className="w-3 h-3" />}
      OK
    </Badge>
  );
};
