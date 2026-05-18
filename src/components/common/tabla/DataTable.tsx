import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type PaginationState,
  type SortingState,
  type OnChangeFn,
} from "@tanstack/react-table";

import { Pagination } from "./Paginacion";
import { ArrowUp, ArrowDown, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowCount: number;
  pagination: PaginationState;
  setPagination: OnChangeFn<PaginationState>;
  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;
  isLoading: boolean;
  isError?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowCount,
  pagination,
  setPagination,
  sorting,
  setSorting,
  isLoading,
  isError,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    pageCount: rowCount > 0 ? Math.ceil(rowCount / pagination.pageSize) : 0,
    state: { pagination, sorting },
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
  });

  // Determinar si mostrar estado vacío
  const isEmpty = !isLoading && !isError && data.length === 0;
  const hasError = !isLoading && isError;

  return (
    <div className="data-table-shell relative min-h-[min(100%,28rem)] sm:min-h-[min(100%,24rem)]">
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center rounded-xl bg-card/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-muted sm:h-14 sm:w-14" />
              <div className="absolute left-0 top-0 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent sm:h-14 sm:w-14" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-card-foreground">
                Cargando datos
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Por favor espera...
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 z-40 flex items-center justify-center rounded-xl bg-card p-6 sm:p-8">
          <div className="flex max-w-md flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 sm:h-16 sm:w-16">
              <svg
                className="h-7 w-7 text-destructive sm:h-8 sm:w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-title mb-2 text-base font-semibold text-card-foreground sm:text-lg">
                Error al cargar datos
              </h3>
              <p className="text-sm text-muted-foreground">
                Error al cargar los datos. Por favor, intenta nuevamente o
                contacta al soporte.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}
      {/* Empty State */}
      {isEmpty && (
        <div className="absolute inset-0 z-40 flex items-center justify-center rounded-xl bg-card p-6 sm:p-8">
          <div className="flex max-w-md flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted sm:h-20 sm:w-20">
              <Search className="h-8 w-8 text-muted-foreground sm:h-10 sm:w-10" />
            </div>
            <div>
              <h3 className="font-title mb-2 text-base font-semibold text-card-foreground sm:text-lg">
                No se encontraron resultados
              </h3>
              <p className="text-sm text-muted-foreground">
                No hay datos disponibles para mostrar. Intenta ajustar los
                filtros o criterios de búsqueda.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Contenedor de la tabla */}
      <div className="data-table-scroll isolate">
        <table className="w-full min-w-max caption-bottom text-sm">
          <thead className="data-table-head">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={`"${headerGroup.id}-data-table-tr"`}>
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  const canSort = header.column.getCanSort();

                  return (
                    <th
                      key={`"${header.id}-data-table-th"`}
                      className={cn(
                        "data-table-th",
                        isSorted && "text-foreground",
                      )}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            "flex min-w-0 items-center gap-1.5",
                            canSort &&
                              "cursor-pointer select-none transition-colors hover:text-foreground",
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span className="truncate">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </span>
                          {canSort && (
                            <span className="shrink-0">
                              {isSorted === "asc" && (
                                <ArrowUp className="h-3.5 w-3.5 text-primary" />
                              )}
                              {isSorted === "desc" && (
                                <ArrowDown className="h-3.5 w-3.5 text-primary" />
                              )}
                              {!isSorted && (
                                <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={`"${row.id}-data-table-tbody-tr"`}
                className="data-table-row"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={`"${cell.id}-data-table-tbody-td"`}
                    className="data-table-td"
                  >
                    <div className="flex min-h-9 min-w-0 items-center sm:min-h-10">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* footer table */}
      <div className="data-table-footer flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-sm font-medium text-muted-foreground">
            Mostrar:
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="h-8 min-w-[4.25rem] cursor-pointer rounded-md border border-input bg-card px-2 text-sm text-card-foreground shadow-xs outline-none transition-[color,box-shadow] hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            {[10, 20, 30].map((pageSize) => (
              <option key={`${pageSize}-table-option-data`} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        <div className="flex w-full items-center justify-center gap-3 sm:w-auto">
          <div className="text-sm text-muted-foreground sm:hidden">
            Total:{" "}
            <span className="font-semibold text-foreground">{rowCount}</span>
          </div>

          <Pagination
            currentPage={table.getState().pagination.pageIndex + 1}
            totalPages={table.getPageCount()}
            onPageChange={(page) => table.setPageIndex(page - 1)}
            canPreviousPage={table.getCanPreviousPage()}
            canNextPage={table.getCanNextPage()}
          />
        </div>

        <div className="hidden text-center text-sm text-muted-foreground lg:block lg:text-right">
          Mostrando registros del{" "}
          <span className="font-medium text-foreground">
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
          </span>{" "}
          al{" "}
          <span className="font-medium text-foreground">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              rowCount,
            )}
          </span>{" "}
          de <span className="font-medium text-foreground">{rowCount}</span>
        </div>
      </div>
    </div>
  );
}
