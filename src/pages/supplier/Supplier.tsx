import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/tabla/DataTable";
import { DebouncedInput } from "@/components/common/tabla/DebouncedInput";
import { useServerTableState } from "@/components/common/tabla/useServerTableState";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useGetSuppliers,
  useDeleteSupplier,
  useUpdateSupplier,
  useCreateSupplier,
} from "@/hooks/useSupplier";
import { Plus, Edit2, Trash2, MoreHorizontal } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { type Supplier } from "@/types/supplier";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModalSupplier } from "@/components/supplier/ModalSupplier";
import type { SupplierFormOutput } from "@/schemes/supplier";

const SuppliersPage = () => {
  const tableState = useServerTableState({});
  const [openModal, setOpenModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(
    null
  );

  const { data: suppliersData, isLoading, isError } = useGetSuppliers({
    pageIndex: tableState.pagination.pageIndex + 1,
    pageSize: tableState.pagination.pageSize,
    globalFilter: tableState.globalFilter,
    sorting: tableState.sorting,
  });

  const { mutateAsync: createSupplier, isPending: creatingSupplier } =
    useCreateSupplier();
  const { mutateAsync: updateSupplier, isPending: updatingSupplier } =
    useUpdateSupplier();
  const { mutate: deleteSupplier } = useDeleteSupplier();

  const handleSubmit = async (data: SupplierFormOutput) => {
    if (editingSupplier) {
      await updateSupplier({ id: editingSupplier.id, data });
      setEditingSupplier(null);
    } else {
      await createSupplier(data);
    }
    setOpenModal(false);
  };

  const handleDelete = (id: string) => {
    setSelectedSupplierId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSupplierId) {
      deleteSupplier(selectedSupplierId);
      setDeleteDialogOpen(false);
      setSelectedSupplierId(null);
    }
  };

  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: "name",
      header: "Nombre",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.email || "-"}
        </span>
      ),
    },
    {
      accessorKey: "phone",
      header: "Teléfono",
      cell: ({ row }) => <span>{row.original.phone || "-"}</span>,
    },
    {
      accessorKey: "address",
      header: "Dirección",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.address || "-"}</span>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setEditingSupplier(row.original);
                setOpenModal(true);
              }}
              className="gap-2 cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(row.original.id)}
              className="gap-2 text-destructive cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="bg-background h-full w-full">
      <div className="h-[calc(100vh-54px)] flex flex-col max-w-7xl mx-auto py-2 gap-2 px-4">
        <div className="flex flex-col gap-3 justify-between md:items-center md:flex-row relative">
          <h1 className="text-2xl font-semibold">Proveedores</h1>
          <div className="flex items-center gap-6">
            <Button
              onClick={() => {
                setEditingSupplier(null);
                setOpenModal(true);
              }}
              className="btn-create w-full gap-2"
            >
              <Plus size={18} />
              Nuevo Proveedor
            </Button>
          </div>
        </div>

        <DebouncedInput
          valueDafault={tableState.globalFilter ?? ""}
          onChange={tableState.onGlobalFilterChange}
          placeholder="Buscar proveedores..."
        />

        <div className="flex-1 min-h-0 w-full">
          <DataTable
            columns={columns}
            data={suppliersData?.data || []}
            rowCount={suppliersData?.rowCount || 0}
            pagination={tableState.pagination}
            setPagination={tableState.setPagination}
            sorting={tableState.sorting}
            setSorting={tableState.setSorting}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </div>

      <ModalSupplier
        isOpen={openModal}
        setOpen={() => setOpenModal(!openModal)}
        onSubmit={handleSubmit}
        initialData={editingSupplier}
        isLoading={creatingSupplier || updatingSupplier}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Proveedor</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar este proveedor? Esta acción
              no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SuppliersPage;
