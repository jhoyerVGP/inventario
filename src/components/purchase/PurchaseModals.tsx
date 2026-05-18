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
import { cn } from "@/lib/utils";

interface Props {
  purchaseId: string | null;
  onClose: () => void;
}

const statusMap = {
  DRAFT: {
    label: "Borrador",
    className:
      "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary",
  },
  CONFIRMED: {
    label: "Confirmada",
    className:
      "border-transparent bg-emerald-500/15 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-500/15",
  },
};

export function PurchaseModals({ purchaseId, onClose }: Props) {
  const { data, isLoading } = useGetPurchaseById(purchaseId);

  return (
    <Dialog open={!!purchaseId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className={cn(
          "flex w-[calc(100vw-1rem)] max-w-[min(56rem,calc(100vw-1rem))] flex-col gap-0 overflow-hidden p-0",
          "max-h-[min(90dvh,44rem)] border-border bg-card font-body shadow-xl",
          "sm:w-auto sm:min-w-[min(100%,28rem)]",
        )}
      >
        <DialogHeader className="shrink-0 border-b border-border px-4 py-3 text-left sm:px-6 sm:py-4">
          <DialogTitle className="font-title text-base text-card-foreground sm:text-lg">
            Detalle de Compra
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {isLoading && (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {data && (
            <div className="flex flex-col gap-4">
              {/* Cabecera */}
              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm text-muted-foreground">Proveedor</p>
                  <p className="text-sm font-medium text-card-foreground">
                    {data.suppliers?.name ?? "—"}
                  </p>
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm text-muted-foreground">Sucursal</p>
                  <p className="text-sm font-medium text-card-foreground">
                    {data.branches?.branchName ?? "—"}
                  </p>
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p className="text-sm font-medium text-card-foreground">
                    {format(new Date(data.created_at), "dd MMM yyyy HH:mm", {
                      locale: es,
                    })}
                  </p>
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge
                    className={cn(
                      "mt-0.5 text-xs font-medium",
                      statusMap[data.status]?.className,
                    )}
                  >
                    {statusMap[data.status]?.label}
                  </Badge>
                </div>
                {data.notes && (
                  <div className="min-w-0 space-y-0.5 sm:col-span-2">
                    <p className="text-sm text-muted-foreground">Notas</p>
                    <p className="text-sm text-card-foreground">{data.notes}</p>
                  </div>
                )}
              </div>

              {/* Tabla de productos */}
              <div className="modal-table-wrap">
                <div className="modal-table-scroll">
                  <table className="modal-table">
                    <thead className="form-table-head">
                      <tr>
                        <th className="form-table-th min-w-[11rem] text-left">
                          Producto
                        </th>
                        <th className="form-table-th w-16 text-right whitespace-nowrap">
                          Cant.
                        </th>
                        <th className="form-table-th w-[6.5rem] text-right whitespace-nowrap">
                          Costo u.
                        </th>
                        <th className="form-table-th w-[6.5rem] text-right whitespace-nowrap">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.purchasedetails.map((d, i) => (
                        <tr key={i} className="form-table-row">
                          <td className="form-table-td min-w-0">
                            <span className="block break-words text-card-foreground">
                              {d.products?.nameProd ?? "—"}
                            </span>
                          </td>
                          <td className="form-table-td text-right tabular-nums whitespace-nowrap">
                            {d.quantity}
                          </td>
                          <td className="form-table-td text-right tabular-nums whitespace-nowrap">
                            Bs. {Number(d.unitcost).toFixed(2)}
                          </td>
                          <td className="form-table-td text-right text-sm font-medium tabular-nums whitespace-nowrap text-card-foreground">
                            Bs. {Number(d.total).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="form-table-foot">
                      <tr>
                        <td
                          colSpan={3}
                          className="form-table-td py-3 text-right text-sm font-semibold text-card-foreground"
                        >
                          Total
                        </td>
                        <td className="form-table-td py-3 text-right text-sm font-semibold tabular-nums whitespace-nowrap text-card-foreground">
                          Bs. {Number(data.total).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
