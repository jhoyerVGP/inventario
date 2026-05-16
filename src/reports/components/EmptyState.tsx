import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 px-4 text-center">
      {icon && <div className="text-muted-foreground/40 text-4xl">{icon}</div>}
      <p className="text-sm font-medium text-foreground/70">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground max-w-xs">{description}</p>
      )}
    </div>
  );
}
