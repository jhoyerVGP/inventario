import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { purchaseSchema, type PurchaseFormValues } from "@/schemes/purchase";
import {
  useCreatePurchase,
  useGetPurchaseById,
  useGetSuppliers,
  useGetProductsForPurchase,
  useUpdatePurchase,
  useConfirmPurchase,
} from "@/hooks/purchase/usePurchase";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft, PackagePlus, Trash2, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useBranches } from "@/hooks/branch/useGetBranchesAll";

export default function CreatePurchase() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const createPurchase = useCreatePurchase();
  const updatePurchase = useUpdatePurchase();
  const confirmPurchase = useConfirmPurchase();

  const { data: suppliers = [], isLoading: isSuppliersLoading } =
    useGetSuppliers();
  const { data: branches = [], isLoading: isBranchesLoading } = useBranches();
  const { data: purchaseData, isLoading: isPurchaseLoading } =
    useGetPurchaseById(id ?? null);

  const getBranchLabel = (branch: any) =>
    branch?.branch_name ?? branch?.branchName ?? "Sucursal sin nombre";

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PurchaseFormValues>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplierid: "",
      branchid: "",
      status: "DRAFT",
      notes: "",
      rows: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rows",
  });

  const watchedBranchId = watch("branchid");
  const watchedRows = watch("rows");

  const isReadOnly = isEditMode && purchaseData?.status === "CONFIRMED";
  const isDraft = !isEditMode || purchaseData?.status === "DRAFT";

  const { data: products = [] } = useGetProductsForPurchase(
    watchedBranchId || null,
  );

  const [productOpen, setProductOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!purchaseData || isInitialized) return;

    const branchId = purchaseData.branchid ?? "";
    const supplierId = purchaseData.supplierid ?? "";

    if (supplierId) setValue("supplierid", supplierId);
    if (branchId) setValue("branchid", branchId);
    setValue("status", purchaseData.status);
    setValue("notes", purchaseData.notes ?? "");

    if (branchId && watchedBranchId !== branchId) return;
    if (branchId && products.length === 0 && purchaseData.purchasedetails.length) return;

    const rows = purchaseData.purchasedetails.map((d) => {
      const prod = products.find((p: any) => p.id === d.productid);
      return {
        productId: d.productid,
        productName: d.products?.nameProd ?? "Producto sin nombre",
        currentStock: prod?.currentStock ?? 0,
        quantity: d.quantity,
        unitCost: d.unitcost,
      };
    });

    setValue("rows", rows);
    setIsInitialized(true);
  }, [
    purchaseData,
    products,
    watchedBranchId,
    setValue,
    isInitialized,
  ]);

  // Total general
  const grandTotal = watchedRows.reduce(
    (acc, r) => acc + (r.quantity || 0) * (r.unitCost || 0),
    0,
  );

  // Agregar producto a la tabla
  const handleSelectProduct = (productId: string) => {
    if (isReadOnly) return;
    const already = fields.find((f) => f.productId === productId);
    if (already) {
      toast.info("Ese producto ya está en la lista", { position: "top-right" });
      setProductOpen(false);
      return;
    }
    const prod = products.find((p: any) => p.id === productId);
    if (!prod) return;
    append({
      productId: prod.id,
      productName: prod.nameProd,
      currentStock: prod.currentStock,
      quantity: 1,
      unitCost: prod.cost,
    });
    setProductOpen(false);
  };

  const onSubmit = (values: PurchaseFormValues) => {
    if (isReadOnly) return;
    const promise = isEditMode
      ? updatePurchase.mutateAsync({ id: id!, formValues: values })
      : createPurchase.mutateAsync({
          formValues: values,
          userId: user!.id,
        });

    toast.promise(promise, {
      loading: isEditMode ? "Actualizando compra..." : "Registrando compra...",
      success: () => {
        navigate("/dashboard/compras");
        return isEditMode
          ? "Compra actualizada correctamente"
          : "Compra registrada correctamente";
      },
      error: (err) =>
        err.message ||
        (isEditMode
          ? "Error al actualizar la compra"
          : "Error al registrar la compra"),
      position: "top-right",
      duration: 4000,
    });
  };

  const onConfirm = handleSubmit(async (values: PurchaseFormValues) => {
    if (!isEditMode || isReadOnly) return;
    const promise = updatePurchase
      .mutateAsync({ id: id!, formValues: values })
      .then(() => confirmPurchase.mutateAsync(id!));

    toast.promise(promise, {
      loading: "Confirmando compra...",
      success: () => {
        navigate("/dashboard/compras");
        return "Compra confirmada correctamente";
      },
      error: (err) => err.message || "Error al confirmar la compra",
      position: "top-right",
      duration: 4000,
    });
  });

  if (isSuppliersLoading || isBranchesLoading || isPurchaseLoading) {
    return (
      <div className="p-4">
        <p className="text-center text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="bg-background-view min-h-full">
      <div className="max-w-6xl mx-auto py-4 px-4 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
          </Button>
          <h1 className="tracking-wide font-title text-xl text-foreground lg:text-2xl">
            {isEditMode ? "Editar Compra" : "Nueva Compra"}
          </h1>
        </div>

        {isReadOnly && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            Esta compra esta confirmada y no se puede editar.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* ── Sección superior ─────────────────────────── */}
          <div className="bg-card border rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Proveedor */}
            <div className="flex flex-col gap-1.5">
              <Label>
                Proveedor <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="supplierid"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger
                      className={errors.supplierid ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map((s: any) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.supplierid && (
                <p className="text-destructive text-xs">
                  {errors.supplierid.message}
                </p>
              )}
            </div>

            {/* Sucursal */}
            <div className="flex flex-col gap-1.5">
              <Label>
                Sucursal <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="branchid"
                render={({ field }) => (
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      // Limpiar filas si cambia la sucursal
                      setValue("rows", []);
                      setIsInitialized(false);
                    }}
                    value={field.value}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger
                      className={errors.branchid ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Seleccionar sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((b: any) => (
                        <SelectItem key={b.id} value={b.id}>
                          {getBranchLabel(b)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.branchid && (
                <p className="text-destructive text-xs">
                  {errors.branchid.message}
                </p>
              )}
            </div>

            {/* Estado */}
            {!isEditMode && (
              <div className="flex flex-col gap-1.5">
                <Label>
                  Estado <span className="text-destructive">*</span>
                </Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Borrador</SelectItem>
                        <SelectItem value="CONFIRMED">Confirmada</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}

            {/* Notas */}
            <div className="flex flex-col gap-1.5">
              <Label>Notas</Label>
              <Textarea
                {...register("notes")}
                placeholder="Observaciones opcionales..."
                className="resize-none h-[38px] min-h-[38px]"
                disabled={isReadOnly}
              />
            </div>
          </div>

          {/* ── Tabla de productos ────────────────────────── */}
          <div className="bg-card border rounded-xl overflow-hidden">
            {/* Toolbar de la tabla */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <p className="font-medium text-sm">Productos a comprar</p>

              {/* Buscador de productos */}
              <Popover open={productOpen} onOpenChange={setProductOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!watchedBranchId || isReadOnly}
                    className="gap-2"
                  >
                    <PackagePlus size={15} />
                    Agregar producto
                    <ChevronsUpDown size={13} className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <Command>
                    <CommandInput placeholder="Buscar producto..." />
                    <CommandList>
                      <CommandEmpty>No se encontraron productos.</CommandEmpty>
                      <CommandGroup>
                        {products.map((p: any) => (
                          <CommandItem
                            key={p.id}
                            value={`${p.nameProd} ${p.sku ?? ""}`}
                            onSelect={() => handleSelectProduct(p.id)}
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">
                                {p.nameProd}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Stock: {p.currentStock} · SKU: {p.sku ?? "—"}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Error de filas */}
            {errors.rows?.root && (
              <p className="text-destructive text-xs px-4 py-1">
                {errors.rows.root.message}
              </p>
            )}
            {typeof errors.rows?.message === "string" && (
              <p className="text-destructive text-xs px-4 py-1">
                {errors.rows.message}
              </p>
            )}

            {/* Tabla */}
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-2.5 font-medium">
                    Producto
                  </th>
                  <th className="text-right px-4 py-2.5 font-medium w-24">
                    Stock actual
                  </th>
                  <th className="text-right px-4 py-2.5 font-medium w-28">
                    Cantidad
                  </th>
                  <th className="text-right px-4 py-2.5 font-medium w-32">
                    Costo unitario
                  </th>
                  <th className="text-right px-4 py-2.5 font-medium w-28">
                    Subtotal
                  </th>
                  <th className="w-12" />
                </tr>
              </thead>
              <tbody>
                {fields.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center text-muted-foreground py-10"
                    >
                      {watchedBranchId
                        ? "Agrega productos usando el botón de arriba"
                        : "Primero selecciona una sucursal"}
                    </td>
                  </tr>
                )}
                {fields.map((field, index) => {
                  const qty = watchedRows[index]?.quantity || 0;
                  const cost = watchedRows[index]?.unitCost || 0;
                  const subtotal = qty * cost;

                  return (
                    <tr key={field.id} className="border-t hover:bg-muted/30">
                      {/* Nombre */}
                      <td className="px-4 py-2">
                        <span className="font-medium">{field.productName}</span>
                      </td>

                      {/* Stock actual */}
                      <td className="px-4 py-2 text-right text-muted-foreground">
                        {field.currentStock}
                      </td>

                      {/* Cantidad */}
                      <td className="px-4 py-2 text-right">
                        <Input
                          type="number"
                          min={1}
                          className="w-20 text-right ml-auto"
                          disabled={isReadOnly}
                          {...register(`rows.${index}.quantity`, {
                            valueAsNumber: true,
                          })}
                        />
                        {errors.rows?.[index]?.quantity && (
                          <p className="text-destructive text-xs text-right">
                            {errors.rows[index]?.quantity?.message}
                          </p>
                        )}
                      </td>

                      {/* Costo unitario */}
                      <td className="px-4 py-2 text-right">
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          className="w-24 text-right ml-auto"
                          disabled={isReadOnly}
                          {...register(`rows.${index}.unitCost`, {
                            valueAsNumber: true,
                          })}
                        />
                        {errors.rows?.[index]?.unitCost && (
                          <p className="text-destructive text-xs text-right">
                            {errors.rows[index]?.unitCost?.message}
                          </p>
                        )}
                      </td>

                      {/* Subtotal */}
                      <td className="px-4 py-2 text-right font-medium">
                        Bs. {subtotal.toFixed(2)}
                      </td>

                      {/* Eliminar */}
                      <td className="px-2 py-2 text-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => remove(index)}
                          disabled={isReadOnly}
                        >
                          <Trash2 size={15} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Footer con total */}
              {fields.length > 0 && (
                <tfoot className="border-t bg-muted/50">
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-3 text-right font-semibold"
                    >
                      Total
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-base">
                      Bs. {grandTotal.toFixed(2)}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* ── Botones ───────────────────────────────────── */}
          <div className="flex justify-end gap-3 pb-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
            {!isReadOnly && (
              <Button
                type="submit"
                disabled={
                  createPurchase.isPending ||
                  updatePurchase.isPending ||
                  confirmPurchase.isPending
                }
                className="btn-create"
              >
                {createPurchase.isPending || updatePurchase.isPending
                  ? isEditMode
                    ? "Guardando..."
                    : "Registrando..."
                  : isEditMode
                    ? "Guardar borrador"
                    : "Registrar Compra"}
              </Button>
            )}
            {isEditMode && isDraft && !isReadOnly && (
              <Button
                type="button"
                onClick={onConfirm}
                disabled={
                  updatePurchase.isPending ||
                  confirmPurchase.isPending ||
                  createPurchase.isPending
                }
                className="btn-create"
              >
                {confirmPurchase.isPending ? "Confirmando..." : "Confirmar Compra"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
