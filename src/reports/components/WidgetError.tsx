import { AlertCircle, RefreshCw } from "lucide-react";

interface WidgetErrorProps {
  message?: string;
  onRetry: () => void;
}

export function WidgetError({
  message = "No se pudo cargar la información",
  onRetry,
}: WidgetErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 px-4 text-center">
      <AlertCircle className="w-8 h-8 text-destructive/60" />
      <p className="text-sm text-muted-foreground">{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-1.5 text-xs text-primary hover:underline"
      >
        <RefreshCw className="w-3 h-3" />
        Reintentar
      </button>
    </div>
  );
}
