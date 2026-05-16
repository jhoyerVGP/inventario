import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetPurchaseById } from "@/hooks/purchase/usePurchase";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Props {
  purchaseId: string | null;
  onClose: () => void;
}

const statusMap = {
  DRAFT: { label: "Borrador", className: "bg-slate-100 text-slate-700" },
  CONFIRMED: { label: "Confirmada", className: "bg-green-100 text-green-700" },
};

export function PurchaseModals({ purchaseId, onClose }: Props) {
  const { data, isLoading } = useGetPurchaseById(purchaseId);

  return (
    <Dialog open={!!purchaseId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalle de Compra</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin" />
          </div>
        )}

        {data && (
          <div className="space-y-4">
            {/* Cabecera */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Proveedor</p>
                <p className="font-medium">{data.suppliers?.name ?? "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sucursal</p>
                <p className="font-medium">
                  {data.branches?.branchName ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Fecha</p>
                <p className="font-medium">
                  {format(new Date(data.created_at), "dd MMM yyyy HH:mm", {
                    locale: es,
                  })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Estado</p>
                <Badge
                  className={`${statusMap[data.status]?.className} border-0`}
                >
                  {statusMap[data.status]?.label}
                </Badge>
              </div>
              {data.notes && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">Notas</p>
                  <p>{data.notes}</p>
                </div>
              )}
            </div>

            {/* Tabla de productos */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-3 py-2">Producto</th>
                    <th className="text-right px-3 py-2">Cant.</th>
                    <th className="text-right px-3 py-2">Costo u.</th>
                    <th className="text-right px-3 py-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {data.purchasedetails.map((d, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">
                        {d.products?.nameProd ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-right">{d.quantity}</td>
                      <td className="px-3 py-2 text-right">
                        Bs. {Number(d.unitcost).toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        Bs. {Number(d.total).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t bg-muted/50">
                  <tr>
                    <td
                      colSpan={3}
                      className="px-3 py-2 text-right font-semibold"
                    >
                      Total
                    </td>
                    <td className="px-3 py-2 text-right font-bold">
                      Bs. {Number(data.total).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
