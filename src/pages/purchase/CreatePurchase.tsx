import { useNavigate, useParams } from "react-router-dom";
import { useGetPurchaseById, useCreatePurchase } from "@/hooks/usePurchase";
import { useGetSuppliers } from "@/hooks/useSupplier";
import { useGetBranches } from "@/hooks/branch/useGetBranches";
import useGetProduct from "@/hooks/product/useGetProduct";
import { FormPurchase } from "@/components/FormPurchase";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import type { PurchaseFormInput } from "@/schemes/purchase";
import type { TableParams } from "@/components/common/tabla/api";
import type { BranchOutput } from "@/types/branch";
import type { ServerTableParams } from "@/components/common/tabla/useServerTableState";

const CreatePurchase = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Hooks para obtener datos
  const suppliersParams: TableParams = {
    pageIndex: 1,
    pageSize: 1000,
  };
  const { data: suppliersData } = useGetSuppliers(suppliersParams);
  const { data: branchesData } = useGetBranches();
  const productsParams: ServerTableParams = {
    page: 1,
    limit: 1000,
    search: "",
    sortField: "created_at",
    sortOrder: "desc",
  };
  const { data: productsData } = useGetProduct(productsParams, null);

  const { data: purchaseData, isLoading: loadingPurchase } = useGetPurchaseById(
    id || ""
  );
  const { mutateAsync: createPurchase, isPending } = useCreatePurchase();

  const handleSubmit = async (data: PurchaseFormInput) => {
    try {
      await createPurchase(data);
      navigate("/compras");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loadingPurchase && id) {
    return <div className="p-4">Cargando...</div>;
  }

  return (
    <div className="w-full h-full p-4 bg-background-view overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/compras")}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Volver
          </Button>
          <h1 className="font-title text-xl lg:text-2xl text-foreground">
            {id ? "Ver Compra" : "Nueva Compra"}
          </h1>
        </div>

        {/* Form */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          {!id ? (
            <FormPurchase
              suppliers={suppliersData?.data || []}
              branches={(branchesData?.data || []) as BranchOutput[]}
              products={productsData?.data || []}
              onSubmit={handleSubmit}
              isLoading={isPending}
            />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Proveedor</label>
                  <p className="text-lg">{purchaseData?.supplier_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Sucursal</label>
                  <p className="text-lg">{purchaseData?.branch_name}</p>
                </div>
              </div>

              {purchaseData?.details && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Productos
                  </label>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-2">Producto</th>
                          <th className="text-right p-2">Cantidad</th>
                          <th className="text-right p-2">Precio Unit.</th>
                          <th className="text-right p-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseData.details.map((detail, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="p-2">
                              {detail.nameProd} ({detail.unit})
                            </td>
                            <td className="text-right p-2">
                              {detail.quantity}
                            </td>
                            <td className="text-right p-2">
                              {parseFloat(detail.unitcost as any).toFixed(2)}
                            </td>
                            <td className="text-right p-2 font-medium">
                              {parseFloat(detail.total as any).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-medium">Total:</span>
                <span className="text-2xl font-bold text-brand">
                  {parseFloat(purchaseData?.total as any).toFixed(2)} Bs.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePurchase;
