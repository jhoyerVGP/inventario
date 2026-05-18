import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  canPreviousPage,
  canNextPage,
}: PaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <div className="flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-sm font-medium text-card-foreground">
        <span className="hidden text-muted-foreground md:inline">Página</span>
        <span className="text-muted-foreground md:hidden">Pág.</span>
        <span className="text-foreground">{currentPage}</span>
        <span className="text-muted-foreground">de</span>
        <span className="text-foreground">{totalPages || 1}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canPreviousPage}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-input bg-card text-card-foreground shadow-xs transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
          title="Anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canNextPage}
          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-input bg-card text-card-foreground shadow-xs transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
          title="Siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
