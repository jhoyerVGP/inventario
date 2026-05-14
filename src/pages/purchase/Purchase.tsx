import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/tabla/DataTable";
import { DebouncedInput } from "@/components/common/tabla/DebouncedInput";
import { useServerTableState } from "@/components/common/tabla/useServerTableState";
import { columnsPurchase } from "./ColumnsPurchase";
import { useGetPurchases, useCancelPurchase } from "@/hooks/usePurchase";
import { useBranch } from "@/context/BranchContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";

const Purchase = () => {
  const navigate = useNavigate();
  const { currentBranch } = useBranch();
  const { mutate: cancelPurchase } = useCancelPurchase();

  const tableState = useServerTableState({});
  useEffect(() => {
    tableState.setPagination({
      pageIndex: 0,
      pageSize: tableState.pagination.pageSize,
    });
  }, [currentBranch]);

  const { data: purchasesData, isLoading, isError } = useGetPurchases(
    {
      pageIndex: tableState.pagination.pageIndex + 1,
      pageSize: tableState.pagination.pageSize,
      globalFilter: tableState.globalFilter,
      sorting: tableState.sorting,
    },
    currentBranch!
  );

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(
    null
  );

  const handleCancelPurchase = (id: string) => {
    setSelectedPurchaseId(id);
    setCancelDialogOpen(true);
  };

  const confirmCancel = () => {
    if (selectedPurchaseId) {
      cancelPurchase(selectedPurchaseId);
      setCancelDialogOpen(false);
      setSelectedPurchaseId(null);
    }
  };

  const columns = columnsPurchase({
    onView: (id) => navigate(`/compras/${id}`),
    onCancel: handleCancelPurchase,
  });

  return (
    <div className="bg-background-view h-full w-full">
      <div className="h-[calc(100vh-54px)] flex flex-col max-w-7xl mx-auto py-2 gap-2 px-4">
        <div className="flex flex-col gap-3 justify-between md:items-center md:flex-row relative">
          <h1 className="text-2xl font-semibold">Compras</h1>
          <div className="flex items-center gap-6">
            <Button
              onClick={() => navigate("/compras/nueva")}
              className="btn-create w-full gap-2"
            >
              <Plus size={18} />
              Nueva Compra
            </Button>
          </div>
        </div>

        <DebouncedInput
          valueDafault={tableState.globalFilter ?? ""}
          onChange={tableState.onGlobalFilterChange}
          placeholder="Buscar compras..."
        />

        <div className="flex-1 min-h-0 w-full">
          <DataTable
            columns={columns}
            data={purchasesData?.data || []}
            rowCount={purchasesData?.rowCount || 0}
            pagination={tableState.pagination}
            setPagination={tableState.setPagination}
            sorting={tableState.sorting}
            setSorting={tableState.setSorting}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </div>

      {/* Cancel Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Compra</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas cancelar esta compra? El stock será
              revertido automáticamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2">
            <AlertDialogCancel>No, mantener</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel} className="bg-destructive hover:bg-destructive/90">
              Sí, cancelar compra
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Purchase;
