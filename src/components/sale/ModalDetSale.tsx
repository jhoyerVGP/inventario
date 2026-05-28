import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Receipt, CheckCircle2, Loader2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SaleH } from "@/types/saleh";
import { Content } from "../sale/compModalDeb/Content";
import { useGetProdSale } from "@/hooks/pdfSale/useGetProdSale";

// IMPORTACIONES DEL PDF
import { pdf } from "@react-pdf/renderer";
import { FormatReceipt } from "../receipts/FormatReceipt";

interface SaleDetailsModalProps {
  sale: SaleH;
  open?: boolean;
  closeModal?: () => void;
}

export const getStatusBadge = (status: string) => {
  const statusConfig: Record<
    string,
    { label: string; classes: string; icon: any }
  > = {
    COMPLETED: {
      label: "COMPLETADO",
      classes:
        "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      icon: CheckCircle2,
    },
    PENDING: {
      label: "PENDIENTE",
      classes:
        "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
      icon: Clock,
    },
    CANCELED: {
      label: "CANCELADO",
      classes: "bg-destructive/15 text-destructive border-destructive/30",
      icon: XCircle,
    },
  };

  const config = statusConfig[status] || {
    label: status,
    classes: "bg-muted text-muted-foreground border-border",
    icon: CheckCircle2,
  };

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border",
        config.classes,
      )}
    >
      <Icon className="w-4 h-4" />
      {config.label}
    </span>
  );
};

export const getPaymentMethod = (method: string) => {
  const methods: Record<string, string> = {
    CASH: "Efectivo",
    CARD: "Tarjeta",
    TRANSFER: "Transferencia",
    QR: "Código QR",
  };
  return methods[method] || method;
};

export const ModalDetSale = ({
  open,
  sale,
  closeModal,
}: SaleDetailsModalProps) => {
  const { data: productsSale, isLoading } = useGetProdSale(sale.id);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    if (!productsSale) return;
    setIsGenerating(true);

    try {
      const blob = await pdf(
        <FormatReceipt data={{ 
          ...sale, 
          items: productsSale,
          userName: sale.employee_name || (sale as any).userName,
          branchName: sale.branch_name || (sale as any).branchName
        }} />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error generando recibo:", error);
      alert("Hubo un error al generar el PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      {/* Cambios clave aquí: 
        1. overflow-hidden para que el modal en sí no haga scroll.
        2. flex y flex-col para estructurar Header (fijo), Body (scroll) y Footer (fijo).
        3. sm:max-w-[450px] para hacerlo un poco más estrecho y centrado tipo "Ticket".
      */}
      <DialogContent className="sm:max-w-[450px] max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden bg-background">
        {/* HEADER FIJO */}
        <DialogHeader className="p-6 pb-4 border-b border-border/50 bg-background shrink-0 z-10 relative shadow-sm">
          <DialogTitle className="text-2xl font-bold font-title text-foreground text-center">
            Detalles de Venta
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1 text-center">
            Información completa de la transacción <br />
            <span className="font-bold text-foreground">
              #{sale.receiptNumber}
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* CONTENIDO CON SCROLL INDEPENDIENTE */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <Content sale={sale} products={productsSale} isLoadingProducts={isLoading} />
        </div>

        {/* FOOTER FIJO (Botones organizados verticalmente) */}
        <DialogFooter className="p-5 border-t border-border/50 bg-background shrink-0 z-10">
          <div className="flex flex-col w-full gap-3 md:flex-row-reverse md:gap-2">
            <Button
              onClick={handleGeneratePDF}
              disabled={isLoading || isGenerating || !productsSale}
              className="w-full md:w-1/2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generando Ticket...
                </>
              ) : (
                <>
                  <Receipt className="w-5 h-5 mr-2" />
                  Imprimir Recibo
                </>
              )}
            </Button>

            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-full md:w-1/2"
              >
                Cerrar
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
