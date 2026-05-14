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
//context de la sucursal
import { useBranch } from "../../context/BranchContext";
import type { ProductModalState } from "@/hooks/product/hooksLogic/useProductModals";

interface ColumnProps {
  openModal: (modal: ProductModalState) => void;
}

export const columnsProduct = ({
  openModal,
}: ColumnProps): ColumnDef<Product>[] => [
  //mostrar nombre y la primera imgane del array de imagenes
  {
    accessorKey: "nameProd",
    header: "Nombre Producto",
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3 relative z-0 min-w-40">
          <img
            loading="lazy"
            src={row.original.main_image || undefined}
            alt={row.original.nameProd}
            className="w-9.5 h-9.5 object-contain rounded block min-w-9.5 min-h-9.5 bg-gray-50"
            style={{ backfaceVisibility: "hidden" }}
          />
          <span className="font-medium text-card-foreground">
            {row.original.nameProd}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "sku",
    header: "Cod. unico",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-card-foreground">{row.original.sku}</span>
    ),
  },
  {
    accessorKey: "category_name",
    header: "Categoría",
    enableSorting: true,
  },
  {
    accessorKey: "brand",
    header: "Marca",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full">
        {row.original.brand || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Precio",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-card-foreground">{row.original.price}</span>
    ),
  },
  {
    accessorKey: "cost",
    header: "Costo",
    enableSorting: true,
  },
  {
    accessorKey: "total_stock",
    header: "Stock",
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.total_stock || 0}</span>
        <StockBadge
          currentStock={row.original.total_stock || 0}
          minimumStock={row.original.minstock || 0}
          size="sm"
          showIcon={true}
        />
      </div>
    ),
  },
  {
    accessorKey: "unit",
    header: "Unidad",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.unit || "-"}
      </span>
    ),
  },
  {
    accessorKey: "supplier_name",
    header: "Proveedor",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm">{row.original.supplier_name || "-"}</span>
    ),
  },
  {
    accessorKey: "minstock",
    header: "Stock Mín.",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.minstock || "0"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const product = row.original;
      //sucursal actual
      const { currentBranch } = useBranch();
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
                <span>Ver Detalles</span>
              </Link>
            </DropdownMenuItem>
            {/* ESTO SOLO SE MUESTRA EN VISTA GLOBAL */}
            {!currentBranch && (
              <>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to={`/dashboard/editp/${product.id}`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    <span>Editar</span>
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
                  <span>Gestionar oferta</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  //onClick={() => setOpenPAB(product.id)}
                  onClick={() =>
                    openModal({ type: "addBranch", productId: product.id })
                  }
                  className="cursor-pointer"
                >
                  <PackagePlus className="mr-2 h-4 w-4" />
                  <span>Agregar a sucursal/es</span>
                </DropdownMenuItem>
              </>
            )}
            {/* ESTO SE CON LA VISTA ESPECIFICA DE SUCURSAL */}
            {!!currentBranch && (
              <>
                <DropdownMenuItem
                  //onClick={() => setOpenAdd(product.id)}
                  onClick={() =>
                    openModal({ type: "addBranchStock", productId: product.id })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Aumentar Strock</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  /* onClick={() =>
                    setOpenRemove(product.id, product.total_stock as number)
                  } */
                  onClick={() =>
                    openModal({
                      type: "remove",
                      productId: product.id,
                      stockCurrent: product.total_stock as number,
                    })
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Quitar Strock</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    //setOpenTransfer(product.id, product.total_stock as number)
                    openModal({
                      type: "transfer",
                      productId: product.id,
                      stockCurrent: product.total_stock as number,
                    })
                  }
                >
                  <Repeat className="mr-2 h-4 w-4" />
                  <span>Transferir Strock</span>
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              //onClick={() => setOpenDelete(product.id)}
              onClick={() =>
                openModal({ type: "delete", productId: product.id })
              }
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
