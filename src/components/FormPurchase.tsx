import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  purchaseFormSchema,
  type PurchaseFormInput,
} from "@/schemes/purchase";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/Form/FormInput";
import { FormSelect } from "@/components/common/Form/FormSelect";
import { PurchaseDetailTable } from "@/components/PurchaseDetailTable";
import type { Supplier } from "@/types/supplier";
import type { BranchOutput } from "@/types/branch";
import type { Product } from "@/types/product";
import type { PurchaseDetailFormRow } from "@/types/purchase";

interface FormPurchaseProps {
  suppliers: Supplier[];
  branches: BranchOutput[];
  products: Product[];
  onSubmit: (data: PurchaseFormInput) => Promise<void>;
  isLoading?: boolean;
}

export const FormPurchase = ({
  suppliers,
  branches,
  products,
  onSubmit,
  isLoading = false,
}: FormPurchaseProps) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PurchaseFormInput>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      supplierid: "",
      branchid: "",
      notes: "",
      details: [{ productid: "", quantity: 0, unitcost: 0 }],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "details",
  });

  const details = watch("details");
  const totalAmount = (details as PurchaseDetailFormRow[]).reduce(
    (sum, detail) => sum + (detail.quantity || 0) * (detail.unitcost || 0),
    0
  );

  const handleAddRow = () => {
    append({ productid: "", quantity: 0, unitcost: 0 });
  };

  const handleUpdateRow = (
    index: number,
    field: keyof PurchaseDetailFormRow,
    value: any
  ) => {
    const currentDetail = details[index];
    update(index, {
      ...currentDetail,
      [field]: value,
    });
  };

  const handleDeleteRow = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Cabecera: Proveedor, Sucursal, Notas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          control={control}
          name="supplierid"
          label="Proveedor"
          placeholder="Seleccionar proveedor"
          error={errors.supplierid}
          options={suppliers.map((s) => ({
            label: s.name,
            value: s.id,
          }))}
        />

        <FormSelect
          control={control}
          name="branchid"
          label="Sucursal"
          placeholder="Seleccionar sucursal"
          error={errors.branchid}
          options={branches.map((b) => ({
            label: b.branchName,
            value: b.id,
          }))}
        />
      </div>

      <FormInput
        control={control}
        name="notes"
        label="Notas (Opcional)"
        placeholder="Información adicional de la compra"
        error={errors.notes}
      />

      {/* Detalles */}
      <div>
        <label className="text-sm font-medium mb-2 block">Productos</label>
        <PurchaseDetailTable
          details={details as PurchaseDetailFormRow[]}
          products={products}
          onAddRow={handleAddRow}
          onUpdateRow={handleUpdateRow}
          onDeleteRow={handleDeleteRow}
        />
        {errors.details && (
          <p className="text-sm text-destructive mt-2">
            {typeof errors.details.message === "string"
              ? errors.details.message
              : "Error en los detalles"}
          </p>
        )}
      </div>

      {/* Resumen */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">Total de Compra:</span>
          <span className="text-2xl font-bold text-brand">
            {totalAmount.toFixed(2)} Bs.
          </span>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading} className="flex-1">
            {isLoading ? "Guardando..." : "Guardar Compra"}
          </Button>
          <Button type="button" variant="outline" className="flex-1">
            Cancelar
          </Button>
        </div>
      </div>
    </form>
  );
};
