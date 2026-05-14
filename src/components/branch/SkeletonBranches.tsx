import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonBranches = () => {
  return (
    <div className="container-branches">
      <div className="branches-content">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card shadow-sm text-card-foreground space-y-4 flex flex-col justify-between"
          >
            {/* Card header skeleton */}
            <div className="flex items-center justify-between gap-3 p-2 border-0">
              <div className="flex items-center gap-2 min-w-0">
                <Skeleton className="h-9 w-9 rounded-lg bg-muted" />
                <Skeleton className="h-4 w-32 bg-muted" />
              </div>
              <Skeleton className="h-7 w-7 rounded-md bg-muted" />
            </div>

            {/* Card body skeleton - address */}
            <div className="py-2 px-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 shrink-0 bg-muted" />
                <Skeleton className="h-4 w-full bg-muted" />
              </div>
            </div>

            {/* Card footer skeleton */}
            <div className="flex flex-col gap-3 items-center justify-between p-2 rounded-b-lg bg-muted/50">
              <div className="flex justify-between w-full">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-3.5 w-3.5 rounded-sm bg-muted-foreground/20" />
                  <Skeleton className="h-3.5 w-20 bg-muted-foreground/20" />
                </div>
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-3.5 w-3.5 rounded-sm bg-muted-foreground/20" />
                  <Skeleton className="h-3.5 w-20 bg-muted-foreground/20" />
                </div>
              </div>
              <div className="flex justify-between w-full">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-3.5 w-3.5 rounded-sm bg-muted-foreground/20" />
                  <Skeleton className="h-3.5 w-24 bg-muted-foreground/20" />
                </div>
                <div className="flex items-center gap-1.5">
                  <Skeleton className="h-3.5 w-3.5 rounded-sm bg-muted-foreground/20" />
                  <Skeleton className="h-3.5 w-20 bg-muted-foreground/20" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
