import { type ColumnDef } from "@tanstack/react-table";
import { type Product } from "@/types/product";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  PackagePlus,
  Plus,
  Repeat,
  Tag,
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
import { Link } from "react-router-dom";
import { StockBadge } from "@/components/product/StockBadge";
import type { ProductModalState } from "@/hooks/product/hooksLogic/useProductModals";

interface ColumnProps {
  openModal: (modal: ProductModalState) => void;
  currentBranch: string | null; // ← viene de afuera
}

export const columnsProduct = ({
  openModal,
  currentBranch,
}: ColumnProps): ColumnDef<Product>[] => [
  {
    accessorKey: "nameProd",
    header: "Producto",
    enableSorting: true,
    cell: ({ row }) => {
      const name = row.original.nameProd || "Sin producto";
      return (
        <div className="flex items-center gap-3 min-w-40">
          <img
            loading="lazy"
            src={row.original.main_image || undefined}
            alt={name}
            className="w-9 h-9 object-contain rounded bg-gray-50 min-w-9 min-h-9"
          />
          <span className="font-medium text-card-foreground">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "sku",
    header: "SKU",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.sku || "Sin SKU"}
      </span>
    ),
  },
  /* {
    accessorKey: "category_name",
    header: "Categoría",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm">{row.original.category_name || "-"}</span>
    ),
  }, */
/*   {
    accessorKey: "brand",
    header: "Marca",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm">{row.original.brand || "-"}</span>
    ),
  }, */
  {
    accessorKey: "supplier_name",
    header: "Proveedor",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.supplier_name || "Sin proveedor"}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Precio",
    enableSorting: true,
    cell: ({ row }) => {
      const price = row.original.price;
      if (price === null || price === undefined) return "Sin precio";
      return <span className="font-medium">Bs. {Number(price).toFixed(2)}</span>;
    },
  },
 /*  {
    accessorKey: "cost",
    header: "Costo",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        Bs. {row.original.cost ? Number(row.original.cost).toFixed(2) : "-"}
      </span>
    ),
  }, */
  /* {
    accessorKey: "unit",
    header: "Unidad",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.unit || "-"}
      </span>
    ),
  }, */
 /*  {
    accessorKey: "barcode",
    header: "Cód. Barras",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.barcode || "-"}
      </span>
    ),
  }, */
  {
    accessorKey: "total_stock",
    header: "Stock",
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.total_stock ?? 0}</span>
        <StockBadge
          currentStock={row.original.total_stock ?? 0}
          minimumStock={row.original.minstock ?? 0}
          size="sm"
          showIcon={true}
        />
      </div>
    ),
  },
 /*  {
    accessorKey: "minstock",
    header: "Stock Mín.",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.minstock ?? 0}
      </span>
    ),
  }, */
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const product = row.original;
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

            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to={`/dashboard/viewp/${product.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalles
              </Link>
            </DropdownMenuItem>

            {/* Vista global */}
            {!currentBranch && (
              <>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to={`/dashboard/editp/${product.id}`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    openModal({
                      type: "manageOffer",
                      productId: product.id,
                      ...product,
                    })
                  }
                >
                  <Tag className="mr-2 h-4 w-4" />
                  Gestionar oferta
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    openModal({ type: "addBranch", productId: product.id })
                  }
                >
                  <PackagePlus className="mr-2 h-4 w-4" />
                  Agregar a sucursal/es
                </DropdownMenuItem>
              </>
            )}

            {/* Vista por sucursal */}
            {!!currentBranch && (
              <>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    openModal({ type: "addBranchStock", productId: product.id })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Aumentar Stock
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    openModal({
                      type: "remove",
                      productId: product.id,
                      stockCurrent: product.total_stock as number,
                    })
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Quitar Stock
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    openModal({
                      type: "transfer",
                      productId: product.id,
                      stockCurrent: product.total_stock as number,
                    })
                  }
                >
                  <Repeat className="mr-2 h-4 w-4" />
                  Transferir Stock
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={() =>
                openModal({ type: "delete", productId: product.id })
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
