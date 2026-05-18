import { Skeleton } from "@/components/ui/skeleton";

interface CreatePurchaseSkeletonProps {
  isEditMode?: boolean;
}

function FieldSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-9 w-full rounded-md" />
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-3 border-t border-border py-2.5 first:border-t-0">
      <Skeleton className="h-4 min-w-0 flex-1" />
      <Skeleton className="h-4 w-10 shrink-0" />
      <Skeleton className="h-9 w-16 shrink-0 rounded-md" />
      <Skeleton className="h-9 w-20 shrink-0 rounded-md" />
      <Skeleton className="h-4 w-16 shrink-0" />
      <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
    </div>
  );
}

export function CreatePurchaseSkeleton({
  isEditMode = false,
}: CreatePurchaseSkeletonProps) {
  return (
    <div
      className="min-h-full w-full bg-background-view font-body"
      aria-busy="true"
      aria-label="Cargando formulario de compra"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-3 py-4 sm:px-4">
        {/* Header */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Skeleton className="size-9 shrink-0 rounded-md" />
          <Skeleton className="h-8 w-44 max-w-[75%] rounded-md sm:h-9 sm:w-52" />
        </div>

        {/* Campos del formulario */}
        <div className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <FieldSkeleton />
          <FieldSkeleton />
          {!isEditMode && <FieldSkeleton />}
          <div
            className={
              isEditMode
                ? "sm:col-span-2 lg:col-span-2"
                : "sm:col-span-2 lg:col-span-1"
            }
          >
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-[2.75rem] w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* Tabla de productos */}
        <div className="form-table-card overflow-hidden">
          <div className="form-table-toolbar">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-9 w-full rounded-md sm:w-44" />
          </div>
          <div className="hidden border-b border-border px-3 py-2.5 sm:flex sm:px-4">
            <Skeleton className="mr-4 h-4 flex-1" />
            <Skeleton className="mr-4 h-4 w-16" />
            <Skeleton className="mr-4 h-4 w-20" />
            <Skeleton className="mr-4 h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="ml-2 h-4 w-8" />
          </div>
          <div className="px-3 py-2 sm:px-4">
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col-reverse gap-2 pb-2 sm:flex-row sm:justify-end sm:gap-3 sm:pb-4">
          <Skeleton className="h-10 w-full rounded-md sm:w-28" />
          <Skeleton className="h-10 w-full rounded-md sm:w-44" />
          {isEditMode && (
            <Skeleton className="h-10 w-full rounded-md sm:w-40" />
          )}
        </div>
      </div>
    </div>
  );
}
