import { type ColumnDef } from "@tanstack/react-table";
import { type CategoryType } from "@/types/category";
import {
  Pencil,
  Trash2,
  Eye /* Calendar */,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

interface props {
  setOpenEdit: (empleado: CategoryType) => void;
  setOpenView: (empleado: CategoryType, disable: boolean) => void;
  setOpenDelete: (empleado: CategoryType) => void;
  setMode: (mode: "create" | "update" | "view") => void;
}

export const columnsCategory = ({
  setOpenEdit,
  setOpenDelete,
  setMode,
}: props): ColumnDef<CategoryType>[] => [
  {
    accessorKey: "nameCat",
    header: "Nombre Categoría",
    enableSorting: true,
    cell: ({ row }) => row.original.nameCat || "Sin categoria",
  },
  {
    accessorKey: "description",
    header: "Descripción Categoría",
    enableSorting: false,
    cell: ({ row }) => {
      const description = row.original.description || "Sin descripcion";
      return (
        <div
          className="w-full max-w-full line-clamp-2 break-words"
          title={description}
        >
          {description}
        </div>
      );
    },
  },
  {
    accessorKey: "total_products",
    header: "Nro Productos",
    enableSorting: true,
    cell: ({ row }) => (
      <div className="text-center w-full max-w-30 truncate">
        {row.original.total_products ?? 0}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const category = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setMode("view");
                setOpenEdit(category);
              }}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              <span>Ver detalles</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setMode("update");
                setOpenEdit(category);
              }}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              <span>Editar</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                setOpenDelete(category);
              }}
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Eliminar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
