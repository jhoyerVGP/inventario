//context de la sucursal
import { DataTable } from "@/components/common/tabla/DataTable";
import { useServerTableState } from "@/components/common/tabla/useServerTableState";
import { useBranch } from "@/context/BranchContext";
import { columnsSaleH } from "@/pages/sale/ColumnsSale";
//hook que trae las ventas realizadas
import { useGetSalesH } from "@/hooks/sale/useGetSales";
import { DebouncedInput } from "@/components/common/tabla/DebouncedInput";
//import del hook para los modales
import { useModalsState } from "@/hooks/sale/hookslogic/useModalsState";
//import de los modales
import { SalesModals } from "@/pages/sale/SalesModals";
//import del hook para el pago de deudas
import { usePayDebt } from "@/hooks/sale/usePayDebt";
//hook para cancelar venta
import { useCancelSale } from "@/hooks/sale/useCancelSale";
//context del usuario
import { useAuth } from "@/context/AuthContext";
import type { DebtPaymentForm } from "@/schemes/debPay";
import { toast } from "sonner";
import { useEffect } from "react";

const Sale = () => {
  //hook de la tabla
  const tableState = useServerTableState({});

  //usamos el contexto de sucursal
  const { currentBranch } = useBranch();
  useEffect(() => {
    tableState.setPagination({
      pageIndex: 0,
      pageSize: tableState.pagination.pageSize,
    });
  }, [currentBranch]);

  //hook que trae las ventas realizadas
  const { data, isLoading, isError } = useGetSalesH({
    ...tableState.apiParams,
    branchId: currentBranch || null,
  });

  //hook para los modales
  const modals = useModalsState();

  //hook para realizar abonos en deudas
  const payDebtMutation = usePayDebt();
  //funcion que maneja el pago de deuda
  const handlePayDebt = (dataForm: DebtPaymentForm) => {
    const promise = payDebtMutation.mutateAsync({
      p_sale_id: modals.typeModal?.sale?.id!,
      p_amount: dataForm.amount,
      p_payment_method: dataForm.paymentMethod!,
      p_note: dataForm.note || "",
    });
    toast.promise(promise, {
      loading: "Procesando el pago de la deuda...",
      success: "Deuda pagada con exito",
      error: "Error al procesar el pago de la deuda",
      position: "top-right",
      duration: 4000,
    });
    modals.closeModal();
  };

  //logica para cancelar una venta
  const cancelSale = useCancelSale();
  const { user } = useAuth();
  const handleCancel = () => {
    const promise = cancelSale.mutateAsync({
      saleId: modals.typeModal?.sale?.id!,
      userId: user?.id!,
    });
    toast.promise(promise, {
      loading: "Cancelando la venta...",
      success: "Venta cancelada con exito",
      error: "Error al cancelar la venta",
      position: "top-right",
      duration: 4000,
    });
    modals.closeModal();
  };

  return (
    <div className="bg-background h-full">
      <div className="h-[calc(100vh-64px)] flex flex-col max-w-7xl mx-auto py-2 gap-2 px-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
          <h1
            className="tracking-wide font-title text-xl text-foreground
            lg:text-2xl"
          >
            Historial de Ventas
          </h1>
          <DebouncedInput
            valueDafault={tableState.globalFilter ?? ""}
            onChange={tableState.onGlobalFilterChange}
            placeholder="Buscar ventas..."
          />
        </div>
        <DataTable
          columns={columnsSaleH({ openM: modals.handleModal })}
          data={data?.data || []}
          rowCount={data?.meta.total ?? 0}
          pagination={tableState.pagination}
          setPagination={tableState.setPagination}
          sorting={tableState.sorting}
          setSorting={tableState.setSorting}
          isLoading={isLoading}
          isError={isError}
        />

        {/* Modales */}
        <SalesModals
          type={modals.typeModal?.typeModal || null}
          sale={modals.typeModal?.sale || null}
          closeModal={modals.closeModal}
          handlePayDebt={handlePayDebt}
          funCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default Sale;
