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
import { CreatePurchaseSkeleton } from "./CreatePurchaseSkeleton";

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
    reset,
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

  const { data: products = [], isLoading: isProductsLoading } = useGetProductsForPurchase(
    watchedBranchId || (isEditMode ? purchaseData?.branchid : null) || null,
  );

  const [productOpen, setProductOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isEditMode) {
      setIsInitialized(true);
      return;
    }

    if (isSuppliersLoading || isBranchesLoading || isPurchaseLoading || isInitialized) return;
    if (!purchaseData) return;

    const branchId = purchaseData.branchid ?? "";
    const supplierId = purchaseData.supplierid ?? "";

    if (branchId && purchaseData.purchasedetails?.length > 0) {
      if (isProductsLoading || products.length === 0) return;
    }

    const rows = (purchaseData.purchasedetails || []).map((d: any) => {
      const prod = products.find((p: any) => p.id === d.productid);
      return {
        productId: d.productid,
        productName: d.products?.nameProd ?? "Producto sin nombre",
        currentStock: prod?.currentStock ?? 0,
        quantity: d.quantity,
        unitCost: d.unitcost,
      };
    });

    reset({
      supplierid: supplierId,
      branchid: branchId,
      status: purchaseData.status ?? "DRAFT",
      notes: purchaseData.notes ?? "",
      rows: rows,
    });

    setIsInitialized(true);
  }, [
    isEditMode,
    isSuppliersLoading,
    isBranchesLoading,
    isPurchaseLoading,
    isProductsLoading,
    purchaseData,
    products,
    reset,
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
    return <CreatePurchaseSkeleton isEditMode={isEditMode} />;
  }

  return (
    <div className="min-h-full w-full bg-background font-body">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-3 py-4 sm:px-4">
        {/* Header */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
          </Button>
          <h1 className="font-title min-w-0 truncate text-xl tracking-tight text-foreground sm:text-2xl">
            {isEditMode ? "Editar Compra" : "Nueva Compra"}
          </h1>
        </div>

        {isReadOnly && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-300 sm:px-4">
            Esta compra esta confirmada y no se puede editar.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* ── Sección superior ─────────────────────────── */}
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
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
            <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
              <Label>Notas</Label>
              <Textarea
                {...register("notes")}
                placeholder="Observaciones opcionales..."
                className="min-h-[2.75rem] resize-none"
                disabled={isReadOnly}
              />
            </div>
          </div>

          {/* ── Tabla de productos ────────────────────────── */}
          <div className="form-table-card">
            <div className="form-table-toolbar">
              <p className="text-sm font-medium text-card-foreground">
                Productos a comprar
              </p>

              {/* Buscador de productos */}
              <Popover open={productOpen} onOpenChange={setProductOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!watchedBranchId || isReadOnly}
                    className="w-full shrink-0 gap-2 sm:w-auto"
                  >
                    <PackagePlus size={15} />
                    <span className="truncate">Agregar producto</span>
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

            <div className="form-table-scroll">
              <table className="form-table">
                <thead className="form-table-head">
                  <tr>
                    <th className="form-table-th min-w-[10rem] text-left">
                      Producto
                    </th>
                    <th className="form-table-th w-24 text-right whitespace-nowrap">
                      Stock actual
                    </th>
                    <th className="form-table-th w-28 text-right whitespace-nowrap">
                      Cantidad
                    </th>
                    <th className="form-table-th w-32 text-right whitespace-nowrap">
                      Costo unitario
                    </th>
                    <th className="form-table-th w-28 text-right whitespace-nowrap">
                      Subtotal
                    </th>
                    <th className="form-table-th w-12" />
                  </tr>
                </thead>
                <tbody>
                  {fields.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="form-table-td py-10 text-center text-muted-foreground"
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
                      <tr key={field.id} className="form-table-row">
                        {/* Nombre */}
                        <td className="form-table-td">
                          <span className="font-medium text-card-foreground">
                            {field.productName}
                          </span>
                        </td>

                        {/* Stock actual */}
                        <td className="form-table-td text-right text-muted-foreground">
                          {field.currentStock}
                        </td>

                        {/* Cantidad */}
                        <td className="form-table-td text-right">
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
                        <td className="form-table-td text-right">
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
                        <td className="form-table-td text-right font-medium text-card-foreground">
                          Bs. {subtotal.toFixed(2)}
                        </td>

                        {/* Eliminar */}
                        <td className="form-table-td text-center">
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
                  <tfoot className="form-table-foot">
                    <tr>
                      <td
                        colSpan={4}
                        className="form-table-td py-3 text-right text-sm font-semibold text-card-foreground"
                      >
                        Total
                      </td>
                      <td className="form-table-td py-3 text-right text-sm font-semibold text-card-foreground">
                        Bs. {grandTotal.toFixed(2)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* ── Botones ───────────────────────────────────── */}
          <div className="flex flex-col-reverse gap-2 pb-2 sm:flex-row sm:justify-end sm:gap-3 sm:pb-4">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
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
