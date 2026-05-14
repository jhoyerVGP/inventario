import { type ColumnDef } from "@tanstack/react-table";
import { type Purchase } from "@/types/purchase";
import {
  MoreHorizontal,
  Eye,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ColumnProps {
  onView?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export const columnsPurchase = ({
  onView,
  onCancel,
}: ColumnProps): ColumnDef<Purchase>[] => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.id.slice(0, 8)}...
      </span>
    ),
  },
  {
    accessorKey: "supplier_name",
    header: "Proveedor",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.supplier_name}</span>
    ),
  },
  {
    accessorKey: "branch_name",
    header: "Sucursal",
    cell: ({ row }) => <span>{row.original.branch_name}</span>,
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => (
      <span className="font-medium text-brand">
        {parseFloat(row.original.total as any).toFixed(2)} Bs.
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.original.status;
      const statusMap: Record<string, { badge: string; color: string }> = {
        PENDING: { badge: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
        RECEIVED: { badge: "Recibido", color: "bg-green-100 text-green-800" },
        CANCELLED: { badge: "Cancelado", color: "bg-red-100 text-red-800" },
      };

      const { badge, color } = statusMap[status] || { badge: "Desconocido", color: "" };

      return <Badge className={color}>{badge}</Badge>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Fecha",
    cell: ({ row }) => (
      <span className="text-sm">
        {format(new Date(row.original.created_at), "dd/MM/yyyy HH:mm")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const canCancel = row.original.status === "RECEIVED";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {onView && (
              <DropdownMenuItem onClick={() => onView(row.original.id)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalle
              </DropdownMenuItem>
            )}

            {onCancel && canCancel && (
              <DropdownMenuItem
                onClick={() => onCancel(row.original.id)}
                className="text-destructive"
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar Compra
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
