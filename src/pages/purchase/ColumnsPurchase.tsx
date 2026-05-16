import type { ColumnDef } from "@tanstack/react-table";
import type { PurchaseRow } from "@/types/purchase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Pencil, Trash2, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const statusMap = {
  DRAFT: { label: "Borrador", className: "bg-slate-100 text-slate-700" },
  CONFIRMED: { label: "Confirmada", className: "bg-green-100 text-green-700" },
};

interface Props {
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onConfirm: (id: string) => void;
}

export const columnsPurchase = ({
  onView,
  onEdit,
  onDelete,
  onConfirm,
}: Props): ColumnDef<PurchaseRow>[] => [
  {
    accessorKey: "created_at",
    header: "Fecha",
    cell: ({ row }) => {
      const createdAt = row.original.created_at;
      if (!createdAt) return "Sin fecha";
      return format(new Date(createdAt), "dd MMM yyyy", { locale: es });
    },
  },
  {
    header: "Proveedor",
    cell: ({ row }) => row.original.suppliers?.name ?? "—",
  },
  {
    header: "Sucursal",
    cell: ({ row }) => row.original.branches?.branchName ?? "—",
  },
  {
    header: "Registrado por",
    cell: ({ row }) => row.original.users?.employees?.name ?? "—",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const total = row.original.total;
      if (total === null || total === undefined) return "Sin total";
      return `Bs. ${Number(total).toFixed(2)}`;
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const statusKey = row.original.status;
      const s = statusKey ? statusMap[statusKey] : undefined;
      if (!s) return <span>Sin estado</span>;
      return (
        <Badge className={`${s.className} border-0 font-medium`}>
          {s.label}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const isConfirmed = row.original.status === "CONFIRMED";
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onView(row.original.id)}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            {!isConfirmed && (
              <>
                <DropdownMenuItem
                  onClick={() => onEdit(row.original.id)}
                  className="cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onConfirm(row.original.id)}
                  className="cursor-pointer"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirmar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(row.original.id)}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
