import { z } from "zod";

export const purchaseSchema = z.object({
  supplierid: z.string().uuid("Selecciona un proveedor"),
  branchid: z.string().uuid("Selecciona una sucursal"),
  status: z.enum(["DRAFT", "CONFIRMED"]),
  notes: z.string().optional(),
  rows: z
    .array(
      z.object({
        productId: z.string().uuid(),
        productName: z.string(),
        currentStock: z.number(),
        quantity: z
          .number({ message: "Requerido" })
          .int()
          .positive("Debe ser mayor a 0"),
        unitCost: z
          .number({ message: "Requerido" })
          .min(0, "No puede ser negativo"),
      }),
    )
    .min(1, "Agrega al menos un producto"),
});

export type PurchaseFormValues = z.infer<typeof purchaseSchema>;
