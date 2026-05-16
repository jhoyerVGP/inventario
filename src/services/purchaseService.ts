import { supabase } from "@/api/supabaseClient";
import type { PurchaseFormValues } from "@/schemes/purchase";
import type { PurchaseRow, PurchaseWithDetails } from "@/types/purchase";

// ── Lista paginada ──────────────────────────────────────────────
import type { ServerTableParams } from "@/components/common/tabla/useServerTableState";

// ── Lista paginada ──────────────────────────────────────────────
export const getPurchases = async (params: ServerTableParams) => {
  const from = (params.page - 1) * params.limit;
  const to = from + params.limit - 1;

  let query = supabase
    .from("purchases")
    .select(
      `
    id, total, status, notes, created_at, updated_at,
    supplierid, branchid, userid,
    suppliers ( name ),
    branches  ( branchName ),
    users     ( employees ( name ) )
  `,
      { count: "exact" },
    )
    .order(params.sortField, { ascending: params.sortOrder === "asc" })
    .range(from, to);

  if (params.search) {
    query = query.ilike("suppliers.name", `%${params.search}%`);
  }
  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  const normalizePurchaseRow = (row: any): PurchaseRow => {
    const supplier = Array.isArray(row?.suppliers)
      ? row.suppliers[0]
      : row?.suppliers;
    const branch = Array.isArray(row?.branches)
      ? row.branches[0]
      : row?.branches;
    const user = Array.isArray(row?.users) ? row.users[0] : row?.users;
    const employee = Array.isArray(user?.employees)
      ? user.employees[0]
      : user?.employees;

    return {
      id: row?.id,
      total: row?.total,
      status: row?.status,
      notes: row?.notes ?? null,
      created_at: row?.created_at,
      updated_at: row?.updated_at,
      supplierid: row?.supplierid ?? null,
      branchid: row?.branchid,
      userid: row?.userid,
      suppliers: supplier ? { name: supplier.name } : null,
      branches: branch ? { branchName: branch.branchName } : null,
      users: employee ? { employees: { name: employee.name } } : null,
    };
  };

  return {
    data: (data ?? []).map(normalizePurchaseRow),
    meta: {
      total: count || 0,
      page: params.page,
      limit: params.limit,
      totalPages: Math.ceil((count || 0) / params.limit),
    },
  };
};

// ── Detalle de una compra ───────────────────────────────────────
export const getPurchaseById = async (
  id: string,
): Promise<PurchaseWithDetails> => {
  const { data, error } = await supabase
    .from("purchases")
    .select(
      `
      id, total, status, notes, created_at, updated_at,
      supplierid, branchid, userid,
      suppliers ( name ),
      branches  ( branchName ),
      users     ( employees ( name ) ),
      purchasedetails (
        productid, quantity, unitcost, total,
        products ( nameProd, sku )
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as PurchaseWithDetails; // ← único lugar donde usamos unknown
};

// ── Actualizar compra + detalles (solo borrador) ────────────────
export const updatePurchase = async (
  id: string,
  formValues: PurchaseFormValues,
): Promise<string> => {
  const { data: current, error: currentError } = await supabase
    .from("purchases")
    .select("status")
    .eq("id", id)
    .single();

  if (currentError) throw new Error(currentError.message);
  if (current?.status !== "DRAFT") {
    throw new Error("Solo se pueden editar compras en borrador");
  }

  const total = formValues.rows.reduce(
    (acc, r) => acc + r.quantity * r.unitCost,
    0,
  );

  const { error: deleteDetailsError } = await supabase
    .from("purchasedetails")
    .delete()
    .eq("purchaseid", id);

  if (deleteDetailsError) throw new Error(deleteDetailsError.message);

  const { error: purchaseError } = await supabase
    .from("purchases")
    .update({
      supplierid: formValues.supplierid,
      branchid: formValues.branchid,
      notes: formValues.notes || null,
      total,
    })
    .eq("id", id);

  if (purchaseError) throw new Error(purchaseError.message);

  const details = formValues.rows.map((r) => ({
    purchaseid: id,
    productid: r.productId,
    quantity: r.quantity,
    unitcost: r.unitCost,
    total: r.quantity * r.unitCost,
  }));

  const { error: detailsError } = await supabase
    .from("purchasedetails")
    .insert(details);

  if (detailsError) throw new Error(detailsError.message);

  return id;
};

// ── Eliminar compra + detalles ─────────────────────────────────
export const deletePurchase = async (id: string): Promise<void> => {
  const { data: current, error: currentError } = await supabase
    .from("purchases")
    .select("status")
    .eq("id", id)
    .single();

  if (currentError) throw new Error(currentError.message);
  if (current?.status !== "DRAFT") {
    throw new Error("Solo se pueden eliminar compras en borrador");
  }

  const { error: detailsError } = await supabase
    .from("purchasedetails")
    .delete()
    .eq("purchaseid", id);

  if (detailsError) throw new Error(detailsError.message);

  const { error } = await supabase.from("purchases").delete().eq("id", id);
  if (error) throw new Error(error.message);
};

// ── Confirmar compra (aplica stock via trigger) ────────────────
export const confirmPurchase = async (id: string): Promise<void> => {
  const { data, error } = await supabase
    .from("purchases")
    .update({ status: "CONFIRMED" })
    .eq("id", id)
    .eq("status", "DRAFT")
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("La compra ya fue confirmada");
};

// ── Crear compra + detalles (borrador, no afecta stock) ─────────
export const createPurchase = async (
  formValues: PurchaseFormValues,
  userId: string,
): Promise<string> => {
  const status = formValues.status ?? "DRAFT";
  const total = formValues.rows.reduce(
    (acc, r) => acc + r.quantity * r.unitCost,
    0,
  );

  // 1. Insertar cabecera
  const { data: purchase, error: purchaseError } = await supabase
    .from("purchases")
    .insert({
      supplierid: formValues.supplierid,
      branchid: formValues.branchid,
      userid: userId,
      notes: formValues.notes || null,
      total,
      status: "DRAFT",
    })
    .select("id")
    .single();

  if (purchaseError) throw new Error(purchaseError.message);

  // 2. Insertar detalles (no impacta stock hasta confirmar)
  const details = formValues.rows.map((r) => ({
    purchaseid: purchase.id,
    productid: r.productId,
    quantity: r.quantity,
    unitcost: r.unitCost,
    total: r.quantity * r.unitCost,
  }));

  const { error: detailsError } = await supabase
    .from("purchasedetails")
    .insert(details);

  if (detailsError) throw new Error(detailsError.message);

  if (status === "CONFIRMED") {
    const { error: confirmError } = await supabase
      .from("purchases")
      .update({ status: "CONFIRMED" })
      .eq("id", purchase.id)
      .eq("status", "DRAFT");

    if (confirmError) throw new Error(confirmError.message);
  }

  return purchase.id;
};

// ── Proveedores para el select ──────────────────────────────────
export const getSuppliers = async () => {
  const { data, error } = await supabase
    .from("suppliers")
    .select("id, name")
    .eq("activo", true)
    .is("deleted_at", null)
    .order("name");

  if (error) throw new Error(error.message);
  return data || [];
};

// ── Productos con stock actual (para buscar en el form) ─────────
export const getProductsForPurchase = async (branchId: string) => {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id, nameProd, sku, cost,
      branchStocks ( stock, branchId )
    `, // ← sin !inner
    )
    .is("deleted_at", null)
    .order("nameProd");

  if (error) throw new Error(error.message);

  return (data || []).map((p) => {
    const stockEntry = (p.branchStocks as any[])?.find(
      (s) => s.branchId === branchId,
    );
    return {
      id: p.id,
      nameProd: p.nameProd,
      sku: p.sku,
      cost: p.cost ?? 0,
      currentStock: stockEntry?.stock ?? 0, // 0 si no tiene stock aún
    };
  });
};
/* export const getProductsForPurchase = async (branchId: string) => {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id, nameProd, sku, cost,
      branchStocks!inner ( stock, branchId )
    `,
    )
    .is("deleted_at", null)
    .eq("branchStocks.branchId", branchId)
    .order("nameProd");

  if (error) throw new Error(error.message);
  return (data || []).map((p) => ({
    id: p.id,
    nameProd: p.nameProd,
    sku: p.sku,
    cost: p.cost ?? 0,
    currentStock: (p.branchStocks as any)?.[0]?.stock ?? 0,
  }));
};
 */
