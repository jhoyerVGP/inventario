import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import type { PurchaseDetailFormRow } from "@/types/purchase";
import type { Product } from "@/types/product";
import { useMemo } from "react";

interface PurchaseDetailTableProps {
  details: PurchaseDetailFormRow[];
  products: Product[];
  onAddRow: () => void;
  onUpdateRow: (index: number, field: string, value: any) => void;
  onDeleteRow: (index: number) => void;
}

export const PurchaseDetailTable = ({
  details,
  products,
  onAddRow,
  onUpdateRow,
  onDeleteRow,
}: PurchaseDetailTableProps) => {
  // Calcular totales
  const total = useMemo(() => {
    return details.reduce((sum, detail) => {
      const subtotal = (detail.quantity || 0) * (detail.unitcost || 0);
      return sum + subtotal;
    }, 0);
  }, [details]);

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <table className="w-full table-auto text-left border-collapse">
          <thead className="bg-ring/10 border-b border-border">
            <tr>
              <th className="px-4 py-3.5 text-xs font-medium uppercase text-muted-foreground">
                Producto
              </th>
              <th className="px-4 py-3.5 text-xs font-medium uppercase text-muted-foreground w-24">
                Cantidad
              </th>
              <th className="px-4 py-3.5 text-xs font-medium uppercase text-muted-foreground w-24">
                Costo Unit.
              </th>
              <th className="px-4 py-3.5 text-xs font-medium uppercase text-muted-foreground w-24">
                Subtotal
              </th>
              <th className="px-4 py-3.5 text-xs font-medium uppercase text-muted-foreground w-12">
                Acción
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {details.map((detail, index) => {
              const subtotal = (detail.quantity || 0) * (detail.unitcost || 0);
              const selectedProduct = products.find(
                (p) => p.id === detail.productid
              );

              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm">
                    <select
                      value={detail.productid || ""}
                      onChange={(e) =>
                        onUpdateRow(index, "productid", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-border rounded-lg bg-card text-card-foreground text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                    >
                      <option value="">
                        {selectedProduct
                          ? `${selectedProduct.nameProd} (${selectedProduct.unit || "Unidad"})`
                          : "Seleccionar producto"}
                      </option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.nameProd} - {product.sku}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-4 py-4 text-sm">
                    <Input
                      type="number"
                      min="1"
                      value={detail.quantity || ""}
                      onChange={(e) =>
                        onUpdateRow(index, "quantity", parseInt(e.target.value) || 0)
                      }
                      placeholder="0"
                      className="text-right"
                    />
                  </td>

                  <td className="px-4 py-4 text-sm">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={detail.unitcost || ""}
                      onChange={(e) =>
                        onUpdateRow(index, "unitcost", parseFloat(e.target.value) || 0)
                      }
                      placeholder="0.00"
                      className="text-right"
                    />
                  </td>

                  <td className="px-4 py-4 text-sm text-right font-medium">
                    {subtotal.toFixed(2)}
                  </td>

                  <td className="px-4 py-4 text-sm text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteRow(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddRow}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar Producto
        </Button>

        <div className="text-right">
          <div className="text-sm text-muted-foreground mb-1">Total</div>
          <div className="text-2xl font-bold text-brand">
            {total.toFixed(2)} Bs.
          </div>
        </div>
      </div>
    </div>
  );
};
