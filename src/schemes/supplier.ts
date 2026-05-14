import { z } from "zod";

export const supplierFormSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  phone: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  notes: z.string().optional(),
  activo: z.boolean().default(true),
});

export type SupplierFormInput = z.input<typeof supplierFormSchema>;
export type SupplierFormOutput = z.output<typeof supplierFormSchema>;
