export function KpiSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="h-8 w-8 rounded-lg bg-muted" />
      </div>
      <div className="h-7 w-32 rounded bg-muted" />
      <div className="h-3 w-20 rounded bg-muted" />
    </div>
  );
}

export function KpiGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <KpiSkeleton key={i} />
      ))}
    </div>
  );
}
