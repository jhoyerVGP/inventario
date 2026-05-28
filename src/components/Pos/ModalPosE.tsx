import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { CartItem, Totals } from "@/types/salePos";
import { saleFormSchema, type SaleFormValues } from "@/schemes/saleExecute";
import { FormSecFinancial } from "./FormSecFinancial";
import { FormSecStateSale } from "./FormSecStateSale";
import { CreditCard } from "lucide-react";

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  carts: CartItem[];
  totals: Totals;
  executeSale: (cart: CartItem[], data: SaleFormValues) => void;
}

export function ModalPosE({
  isOpen,
  setIsOpen,
  carts,
  totals,
  executeSale,
}: Props) {
  const methods = useForm<SaleFormValues>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      name: "",
      idNit: "",
      paymentMethod: undefined,
      status: undefined,
      isGeneric: false,
      totalReal: Number(totals.calculatedTotal.toFixed(2)),
      totalCobrado: Number(totals.calculatedTotal.toFixed(2)),
      hayDeuda: false,
    },
  });

  const isGeneric = methods.watch("isGeneric");

  useEffect(() => {
    if (isGeneric) {
      methods.setValue("name", "S/N");
      methods.setValue("idNit", "0");
    } else {
      methods.setValue("name", "");
      methods.setValue("idNit", "");
    }
  }, [isGeneric, methods.setValue]);

  useEffect(() => {
    methods.setValue("totalReal", Number(totals.calculatedTotal.toFixed(2)));
    methods.setValue("totalCobrado", Number(totals.calculatedTotal.toFixed(2)));
  }, [totals.calculatedTotal, methods.setValue]);

  useEffect(() => {
    if (carts.length === 0) {
      methods.reset();
    }
  }, [carts, methods.reset]);

  const onSubmit = (data: SaleFormValues) => {
    executeSale(carts, data);
    setIsOpen(false);
    methods.reset();
  };

  return (
    <FormProvider {...methods}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="bg-card border border-border rounded-2xl shadow-2xl gap-0 max-w-[calc(100%-1.5rem)] max-h-[92vh] flex flex-col p-0 overflow-hidden select-none
            sm:max-w-[540px] 
            md:max-w-[800px]"
        >
          {/* Cabecera Ejecutiva */}
          <DialogHeader className="p-4 md:p-5 border-b border-border bg-card shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand/10 text-brand rounded-xl border border-brand/10 shrink-0">
                <CreditCard size={18} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <DialogTitle className="text-base font-title font-bold text-foreground tracking-tight">
                  Finalizar Operación de Venta
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Establece el método de pago y la asignación fiscal del
                  comprobante.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Formulario Estructurado */}
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 min-h-0 bg-background-view/5"
          >
            <div className="flex-1 overflow-y-auto p-4 md:p-5 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                {/* Bloque Izquierdo: Finanzas */}
                <div className="bg-card/50 border border-border/70 p-4 rounded-xl shadow-xs space-y-3">
                  <div className="flex items-center gap-1.5 border-b border-border/60 pb-2 mb-1">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      01
                    </span>
                    <h3 className="text-xs font-title font-bold text-foreground/90 uppercase tracking-wider">
                      Gestión de Liquidación
                    </h3>
                  </div>
                  <FormSecFinancial />
                </div>

                {/* Bloque Derecho: Fiscal/Cliente */}
                <div className="bg-card/50 border border-border/70 p-4 rounded-xl shadow-xs space-y-3">
                  <div className="flex items-center gap-1.5 border-b border-border/60 pb-2 mb-1">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      02
                    </span>
                    <h3 className="text-xs font-title font-bold text-foreground/90 uppercase tracking-wider">
                      Cliente & Comprobante
                    </h3>
                  </div>
                  <FormSecStateSale isGeneric={isGeneric} />
                </div>
              </div>
            </div>

            {/* Acciones del Sistema */}
            <div className="p-4 border-t border-border bg-card shrink-0 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full sm:w-auto px-4 h-9 text-xs font-title font-semibold border-border hover:bg-muted active:scale-[0.98] transition-all cursor-pointer"
                >
                  Volver al POS
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="w-full sm:w-auto px-5 h-9 text-xs font-title font-bold bg-brand text-brand-foreground hover:bg-brand-hover-dark active:scale-[0.98] transition-all cursor-pointer shadow-sm border border-brand/10"
              >
                Confirmar y Cobrar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
