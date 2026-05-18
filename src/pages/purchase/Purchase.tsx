import { DataTable } from "@/components/common/tabla/DataTable";
import { DebouncedInput } from "@/components/common/tabla/DebouncedInput";
import { useServerTableState } from "@/components/common/tabla/useServerTableState";
import { columnsPurchase } from "./ColumnsPurchase";
import { useGetPurchases } from "@/hooks/purchase/usePurchase";
import { PurchaseModals } from "@/components/purchase/PurchaseModals";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { PurchaseRow } from "@/types/purchase";
import {
  useDeletePurchase,
  useConfirmPurchase,
} from "@/hooks/purchase/usePurchase";
import { AlertDelete } from "@/components/common/AlertDelet";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Purchases() {
  const tableState = useServerTableState({});
  const { data, isLoading, isError } = useGetPurchases(tableState.apiParams);
  const navigate = useNavigate();
  const { mutateAsync: deletePurchase } = useDeletePurchase();
  const { mutateAsync: confirmPurchase } = useConfirmPurchase();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    const promise = deletePurchase(deleteId);
    toast.promise(promise, {
      loading: "Eliminando compra...",
      success: "Compra eliminada correctamente",
      error: (err) => err.message || "Error al eliminar la compra",
      position: "top-right",
      duration: 4000,
    });
    setDeleteOpen(false);
    setDeleteId(null);
  };

  const handleConfirm = (id: string) => {
    setConfirmId(id);
    setConfirmOpen(true);
  };

  const confirmPurchaseFlow = () => {
    if (!confirmId) return;
    const promise = confirmPurchase(confirmId);
    toast.promise(promise, {
      loading: "Confirmando compra...",
      success: "Compra confirmada correctamente",
      error: (err) => err.message || "Error al confirmar la compra",
      position: "top-right",
      duration: 4000,
    });
    setConfirmOpen(false);
    setConfirmId(null);
  };

  return (
    <div className="bg-background h-full">
      <div className="h-[calc(100vh-54px)] flex flex-col max-w-7xl mx-auto py-2 gap-2 px-4">
        <div className="flex flex-col gap-3 justify-between md:items-center shrink-0 md:flex-row">
          <h1 className="tracking-wide font-title text-xl text-foreground lg:text-2xl">
            Lista de Compras
          </h1>
          <Button asChild className="btn-create w-full md:w-auto">
            <Link to="create-purchase">
              <Plus size={18} />
              <span>Nueva Compra</span>
            </Link>
          </Button>
        </div>

        <DebouncedInput
          valueDafault={tableState.globalFilter ?? ""}
          onChange={tableState.onGlobalFilterChange}
          placeholder="Buscar por proveedor..."
        />

        <DataTable
          columns={columnsPurchase({
            onView: setSelectedId,
            onEdit: (id) => navigate(`/dashboard/compras/${id}`),
            onDelete: handleDelete,
            onConfirm: handleConfirm,
          })}
          data={(data?.data as PurchaseRow[]) || []}
          rowCount={data?.meta.total ?? 0}
          pagination={tableState.pagination}
          setPagination={tableState.setPagination}
          sorting={tableState.sorting}
          setSorting={tableState.setSorting}
          isLoading={isLoading}
          isError={isError}
        />

        <PurchaseModals
          purchaseId={selectedId}
          onClose={() => setSelectedId(null)}
        />

        <AlertDelete
          title="Eliminar Compra"
          description="¿Estás seguro de que deseas eliminar esta compra? Esta acción no se puede deshacer."
          isOpen={deleteOpen}
          setOpenAlert={() => setDeleteOpen(!deleteOpen)}
          funDelete={confirmDelete}
        />

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Compra</AlertDialogTitle>
              <AlertDialogDescription>
                Al confirmar, la compra queda bloqueada y se actualiza el
                inventario. Esta accion no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-2">
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmPurchaseFlow}
                className="btn-create"
              >
                Confirmar
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
