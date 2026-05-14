import { z } from "zod";

export const purchaseDetailSchema = z.object({
  productid: z.string().min(1, "Producto requerido"),
  quantity: z.coerce
    .number()
    .min(1, "La cantidad debe ser mayor a 0"),
  unitcost: z.coerce
    .number()
    .min(0, "El costo no puede ser negativo"),
});

export const purchaseFormSchema = z.object({
  supplierid: z.string().min(1, "Proveedor requerido"),
  branchid: z.string().min(1, "Sucursal requerida"),
  notes: z.string().optional(),
  details: z
    .array(purchaseDetailSchema)
    .min(1, "Agregar mínimo 1 producto a la compra"),
});

export type PurchaseFormInput = z.infer<typeof purchaseFormSchema>;
export type PurchaseDetailInput = z.infer<typeof purchaseDetailSchema>;
