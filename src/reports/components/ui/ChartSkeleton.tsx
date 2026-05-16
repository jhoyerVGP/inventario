export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div
      className="w-full rounded-xl border border-border bg-card animate-pulse"
      style={{ height }}
    >
      <div className="p-5 flex flex-col gap-3 h-full">
        <div className="flex items-center justify-between">
          <div className="h-4 w-32 rounded bg-muted" />
          <div className="h-7 w-40 rounded-lg bg-muted" />
        </div>
        <div className="flex-1 flex items-end gap-2 pb-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-muted"
              style={{ height: `${30 + Math.random() * 60}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card animate-pulse">
      <div className="p-4 border-b border-border">
        <div className="h-4 w-36 rounded bg-muted" />
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="flex flex-col gap-1">
                <div className="h-3 w-28 rounded bg-muted" />
                <div className="h-2 w-16 rounded bg-muted" />
              </div>
            </div>
            <div className="h-3 w-14 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
