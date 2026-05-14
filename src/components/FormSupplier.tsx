import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  supplierFormSchema,
  type SupplierFormInput,
  type SupplierFormOutput,
} from "@/schemes/supplier";
import { FormInput } from "@/components/common/Form/FormInput";
import type { Supplier } from "@/types/supplier";

interface FormSupplierProps {
  initialData?: Supplier;
  onSubmit: (data: SupplierFormOutput) => Promise<void>;
}

export const FormSupplier = ({
  initialData,
  onSubmit,
}: FormSupplierProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormInput>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: initialData || {
      name: "",
      phone: "",
      address: "",
      email: "",
      notes: "",
      activo: true,
    },
  });

  const handleFormSubmit = async (data: SupplierFormInput) => {
    const parsed = supplierFormSchema.parse(data);
    await onSubmit(parsed);
  };

  return (
    <form
      id="form-supplier"
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4"
    >
      <FormInput
        name="name"
        label="Nombre"
        register={register}
        errors={errors}
        inputProps={{ type: "text", placeholder: "Nombre del proveedor" }}
      />

      <FormInput
        name="email"
        label="Email"
        register={register}
        errors={errors}
        inputProps={{ type: "email", placeholder: "email@ejemplo.com" }}
      />

      <FormInput
        name="phone"
        label="Teléfono"
        register={register}
        errors={errors}
        inputProps={{ type: "text", placeholder: "+591 123 456 789" }}
      />

      <FormInput
        name="address"
        label="Dirección"
        register={register}
        errors={errors}
        inputProps={{ type: "text", placeholder: "Calle y número" }}
      />

      <FormInput
        name="notes"
        label="Notas"
        register={register}
        errors={errors}
        inputProps={{ type: "text", placeholder: "Información adicional" }}
      />
    </form>
  );
};
