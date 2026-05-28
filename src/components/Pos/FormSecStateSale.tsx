import { Controller, useFormContext } from "react-hook-form";
import type { SaleFormValues } from "@/schemes/saleExecute";
import { Input } from "../ui/input";
import { FormSelect } from "../common/Form/FormSelect";
import { UserCheck } from "lucide-react";

export const FormSecStateSale = ({ isGeneric }: { isGeneric: boolean }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<SaleFormValues>();

  return (
    <div className="space-y-4">
      {/* Opción Venta Rápida */}
      <Controller
        name="isGeneric"
        control={control}
        render={({ field }) => (
          <label
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
              field.value
                ? "bg-brand/5 border-brand/40 text-brand shadow-xs"
                : "bg-background border-border hover:bg-muted/50 text-muted-foreground"
            }`}
          >
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="size-4 rounded border-border text-brand focus:ring-brand cursor-pointer accent-brand shrink-0"
            />
            <div className="flex items-center gap-2 text-left min-w-0">
              <UserCheck
                size={15}
                className={field.value ? "text-brand" : "text-muted-foreground"}
              />
              <div className="flex flex-col">
                <span className="text-xs font-title font-bold text-foreground leading-none">
                  Venta rápida / Sin datos fiscales
                </span>
                <span className="text-[10px] text-muted-foreground/80 mt-1">
                  Omite la carga manual de información de facturación
                </span>
              </div>
            </div>
          </label>
        )}
      />

      {/* Grilla Identificación Cliente */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-12 sm:col-span-4 flex flex-col gap-1.5 text-left">
          <label className="text-xs font-title font-semibold text-foreground">
            NIT / CI
          </label>
          <Controller
            name="idNit"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={isGeneric}
                className="h-9 text-xs disabled:bg-muted/40 disabled:text-muted-foreground/60 disabled:cursor-not-allowed border-border focus-visible:ring-brand/20 focus-visible:border-brand transition-all"
                placeholder="0"
              />
            )}
          />
          {errors.idNit && (
            <p className="text-destructive text-[11px] font-medium mt-0.5">
              {errors.idNit.message}
            </p>
          )}
        </div>

        <div className="col-span-12 sm:col-span-8 flex flex-col gap-1.5 text-left">
          <label className="text-xs font-title font-semibold text-foreground">
            Nombre Cliente
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                disabled={isGeneric}
                className="h-9 text-xs disabled:bg-muted/40 disabled:text-muted-foreground/60 disabled:cursor-not-allowed border-border focus-visible:ring-brand/20 focus-visible:border-brand transition-all"
                placeholder="S/N"
              />
            )}
          />
          {errors.name && (
            <p className="text-destructive text-[11px] font-medium mt-0.5">
              {errors.name.message}
            </p>
          )}
        </div>
      </div>

      {/* Selectores de Parametrización */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-left">
        <FormSelect
          control={control}
          label="Metodo de pago"
          name="paymentMethod"
          errors={errors}
          placeholder="Seleccione un método"
          options={[
            { value: "CASH", label: "Efectivo" },
            { value: "CARD", label: "Tarjeta" },
            { value: "TRANSFER", label: "Transferencia" },
            { value: "QR", label: "Código QR" },
          ]}
        />

        <FormSelect
          control={control}
          label="Estado de la Venta"
          name="status"
          errors={errors}
          placeholder="Seleccione el estado"
          options={[
            { value: "PENDING", label: "Pendiente" },
            { value: "COMPLETED", label: "Completada" },
          ]}
        />
      </div>
    </div>
  );
};
