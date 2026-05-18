//imports para la tabla
import { DataTable } from "../../components/common/tabla/DataTable";
import { DebouncedInput } from "../../components/common/tabla/DebouncedInput";
import { useServerTableState } from "../../components/common/tabla/useServerTableState";
//columnas de la tabla
import { columnsProduct } from "./ColumnsProduct";
//context de la sucursal
import { useBranch } from "../../context/BranchContext";
//context del usuario
import { useAuth } from "@/context/AuthContext";
//hook para obtener productos
import useGetprodut from "@/hooks/product/useGetProduct";
//hook para eliminar producto simulado - soft delete de manera global
import { useDeleteProduct } from "@/hooks/product/useDeleteProduct";
//hook para eliminar producto de una sucursal especifica
import { useDeleteProductE } from "@/hooks/product/useDeleteProductE";
//hook para agregar producto a sucursal/es
import { useStockBranch } from "@/hooks/stockBranch/useStockBranch";
//hook para quitar stock a un producto en una sucursal
import { useRemoveStockFromBranch } from "@/hooks/stockBranch/useRemoveStockFromBranch";
//hook para transferir stock entre sucursales
import { useTransferStock } from "@/hooks/stockBranch/useTransferStock";
//type para el input de stock por sucursal
import type { StockBranchI } from "@/types/stockProdBranch";
//hook de logica de modales
import { useProductModals } from "@/hooks/product/hooksLogic/useProductModals";
import { ProductModals } from "./ProductModals";
//shadcn - react
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAddStockBranch } from "@/hooks/stockBranch/useAddStockBranch";
import type {
  AddStockFormValues,
  RemoveStockValues,
  TransferStockValues,
} from "@/schemes/branchProd";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useActiveOffer } from "@/hooks/product/useActiveOffer";
import type { OfferFormValues } from "@/schemes/product";

export default function Product() {
  //logica de la tabla
  const tableState = useServerTableState({});

  //usamos el contexto de sucursal
  const { currentBranch } = useBranch();
  useEffect(() => {
    tableState.setPagination({
      pageIndex: 0,
      pageSize: tableState.pagination.pageSize,
    });
  }, [currentBranch]);

  //usamos el contexto de usuario
  const { user } = useAuth();

  //obtenemos los productos segun el estado de la tabla y la sucursal actual
  const { data, isLoading, isError } = useGetprodut(
    tableState.apiParams,
    currentBranch,
  );

  //usamos el hook de modales y sus funciones para abrir y cerrar
  const { modal, openModal, closeModal } = useProductModals();

  //logica de elimnacion con condicion o es global o es especifica
  const deleteProd = useDeleteProduct(); //global
  const deleteProdE = useDeleteProductE(); //especifica
  //funcion para eliminar producto
  const handleDelete = (id: string) => {
    const promise = currentBranch
      ? deleteProdE.mutateAsync({ id, branchId: currentBranch })
      : deleteProd.mutateAsync(id);

    toast.promise(promise, {
      loading: "Eliminando producto...",
      success: currentBranch
        ? "Producto eliminado de la sucursal"
        : "Producto eliminado globalmente",
      error: (err) => err.message || "Error al eliminar producto",
      position: "top-right",
      duration: 4000,
    });
  };

  //logica para agregar producto a sucursal/es
  const addprod = useStockBranch();
  //funcion para agregar producto a sucursal/es
  const handleAddProdBranch = (
    dataStock: StockBranchI[],
    productId: string,
  ) => {
    const promise = addprod.mutateAsync({
      dataStock,
      pId: productId,
    });

    toast.promise(promise, {
      loading: "Agregando producto a sucursal/es...",
      success: "Producto agregado a sucursal/es correctamente",
      error: (err) =>
        err.message || "Error al agregar el producto a sucursal/es",
      position: "top-right",
      duration: 4000,
    });
  };

  //logica para agregar stock a un producto en la sucursal actual
  const addStock = useAddStockBranch();
  //funcion para agregar stock
  const handleAddStock = (dataI: AddStockFormValues) => {
    if (modal.type !== "addBranchStock") return;
    const promise = addStock.mutateAsync({
      branchId: currentBranch!,
      productId: modal.productId!,
      dataI,
      userId: user?.id!,
    });
    toast.promise(promise, {
      loading: "Agregando stock...",
      success: "Stock agregado correctamente",
      error: (err) => err.message || "Error al agregar stock",
      position: "top-right",
      duration: 4000,
    });
  };

  //logica para quitar stock a un producto en la sucursal actual
  const removeStock = useRemoveStockFromBranch();
  //funcion para quitar stock
  const handleRemoveStock = (dataI: RemoveStockValues) => {
    if (modal.type !== "remove") return;
    const promise = removeStock.mutateAsync({
      branchId: currentBranch!,
      productId: modal.productId!,
      dataI,
      userId: user?.id!,
    });
    toast.promise(promise, {
      loading: "Quitando stock...",
      success: "Stock quitado correctamente",
      error: (err) => err.message || "Error al quitar stock",
      position: "top-right",
      duration: 4000,
    });
  };

  //logica para transferir stock entre sucursales
  const transferStock = useTransferStock();
  //funcion para transferir stock
  const handleTransferStock = (dataI: TransferStockValues) => {
    if (modal.type !== "transfer") return;
    const promise = transferStock.mutateAsync({
      dataI,
      branchFrom: currentBranch!,
      userId: user?.id!,
      productId: modal.productId!,
    });
    toast.promise(promise, {
      loading: "Transfiriendo stock...",
      success: "Stock transferido correctamente",
      error: (err) => err.message || "Error al transferir stock",
      position: "top-right",
      duration: 4000,
    });
  };

  //logica para activar una oferta en un producto
  const activeOffer = useActiveOffer();
  const handleActiveOffer = (dataOffer: OfferFormValues) => {
    if (modal.type !== "manageOffer") return;
    const promise = activeOffer.mutateAsync({
      offerData: dataOffer,
      prodId: modal.productId!,
    });
    toast.promise(promise, {
      loading: "Activando oferta...",
      success: "Oferta activada correctamente",
      error: (err) => err.message || "Error al activar oferta",
      position: "top-right",
      duration: 4000,
    });
  };

  return (
    <div className="bg-background h-full">
      <div className="h-[calc(100vh-54px)] flex flex-col max-w-7xl mx-auto py-2 gap-2 px-4">
        <div
          className="flex flex-col gap-3 justify-between md:items-center shrink-0
      md:flex-row relative"
        >
          <h1
            className="tracking-wide font-title text-xl text-foreground
            lg:text-2xl"
          >
            Lista de Productos
          </h1>
          {!currentBranch && (
            <Button asChild className="btn-create w-full">
              <Link to="../createp">
                <Plus size={18} />
                <span>Agregar Producto</span>
              </Link>
            </Button>
          )}
        </div>
        <DebouncedInput
          valueDafault={tableState.globalFilter ?? ""}
          onChange={tableState.onGlobalFilterChange}
          placeholder="Buscar productos..."
        />
        <div className="flex-1 min-h-0">
          <DataTable
            columns={columnsProduct({ openModal, currentBranch })}
            data={data?.data || []}
            rowCount={data?.meta.total ?? 0}
            pagination={tableState.pagination}
            setPagination={tableState.setPagination}
            sorting={tableState.sorting}
            setSorting={tableState.setSorting}
            isLoading={isLoading}
            isError={isError}
          />
        </div>

        {/* MODALES */}
        <ProductModals
          modal={modal}
          closeModal={closeModal}
          onDelete={handleDelete}
          onAddBranch={handleAddProdBranch}
          onAddStock={handleAddStock}
          onRemoveStock={handleRemoveStock}
          onTransferStock={handleTransferStock}
          onActiveOffer={handleActiveOffer}
        />
      </div>
    </div>
  );
}
