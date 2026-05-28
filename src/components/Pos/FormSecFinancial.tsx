import { useFormContext } from "react-hook-form";
import { FormInput } from "../common/Form/FormInput";
import type { SaleFormValues } from "@/schemes/saleExecute";
import { useEffect } from "react";
import { DollarSign, AlertCircle } from "lucide-react";

export function FormSecFinancial() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<SaleFormValues>();

  const hayDeuda = watch("hayDeuda");
  const totalCobrado = watch("totalCobrado");
  const totalReal = watch("totalReal");

  useEffect(() => {
    if (!hayDeuda) {
      setValue("montoRecibido", undefined);
    }
  }, [hayDeuda, setValue]);

  return (
    <div className="space-y-4">
      {/* Contenedor del Total - Estilo Terminal Premium */}
      <div className="bg-muted/40 border border-border/80 rounded-xl p-4 flex items-center justify-between shadow-xs">
        <div className="space-y-0.5 text-left">
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-muted-foreground/80 block">
            Monto Neto a Liquidar
          </span>
          <span className="text-2xl font-title font-black text-foreground tracking-tight">
            Bs. {Number(totalReal).toFixed(2)}
          </span>
        </div>
        <div className="p-2.5 bg-brand/10 text-brand rounded-lg border border-brand/20 shrink-0">
          <DollarSign size={20} strokeWidth={2.5} />
        </div>
      </div>

      {/* Toggle de Deuda - Fila de Control Completa */}
      <label
        className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
          hayDeuda
            ? "bg-destructive/5 border-destructive/30 text-destructive shadow-xs"
            : "bg-background border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <AlertCircle
            size={16}
            className={
              hayDeuda
                ? "text-destructive shrink-0"
                : "text-muted-foreground shrink-0"
            }
          />
          <div className="flex flex-col text-left min-w-0">
            <span className="text-xs font-title font-bold text-foreground leading-none">
              ¿Registrar saldo pendiente?
            </span>
            <span className="text-[10px] text-muted-foreground/80 mt-1 truncate">
              Habilita el control de cuentas por cobrar para este cliente
            </span>
          </div>
        </div>
        <input
          type="checkbox"
          {...register("hayDeuda")}
          className="size-4 rounded border-border text-brand focus:ring-brand cursor-pointer accent-brand shrink-0"
        />
      </label>

      {/* Grilla de Entradas Numéricas */}
      <div className="grid grid-cols-1 gap-4 pt-1">
        <FormInput
          label="Total cobrado"
          name="totalCobrado"
          register={register}
          errors={errors}
          inputProps={{
            type: "number",
            placeholder: `Sugerido: ${totalReal}`,
            step: "0.01",
            className: "font-mono font-bold text-sm",
          }}
        />

        {hayDeuda && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <FormInput
              label="Monto recibido (Acuenta)"
              name="montoRecibido"
              register={register}
              errors={errors}
              inputProps={{
                type: "number",
                placeholder: `Recibido de ${totalCobrado || Number(totalReal).toFixed(2)}`,
                step: "0.01",
                className: "font-mono font-bold text-sm",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
