import { supabase } from "@/api/supabaseClient";
import type { Purchase, PurchaseDetailInput } from "@/types/purchase";
import type { TableParams } from "@/components/common/tabla/api";

// Get purchases with filters
export const getPurchases = async (
  params: TableParams,
  branchId?: string,
  supplierId?: string
) => {
  const from = (params.pageIndex - 1) * params.pageSize;
  const to = from + params.pageSize - 1;

  let query = supabase
    .from("purchases")
    .select(
      `
      *,
      suppliers:supplierid(name),
      branches:branchid(branchName),
      users:userid(email)
    `,
      { count: "exact" }
    );

  if (branchId) {
    query = query.eq("branchid", branchId);
  }

  if (supplierId) {
    query = query.eq("supplierid", supplierId);
  }

  // Aplicar búsqueda global
  if (params.globalFilter) {
    query = query.or(
      `id.ilike.%${params.globalFilter}%,notes.ilike.%${params.globalFilter}%`
    );
  }

  // Ordenamiento
  if (params.sorting?.length > 0) {
    const sortConfig = params.sorting[0];
    query = query.order(sortConfig.id, {
      ascending: sortConfig.desc === false,
    });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error, count } = await query.range(from, to);

  if (error) throw new Error(error.message);

  // Transformar datos para UI
  const formatted = data?.map((p) => ({
    ...p,
    supplier_name: (p.suppliers as any)?.name,
    branch_name: (p.branches as any)?.branchName,
    user_email: (p.users as any)?.email,
  }));

  return {
    data: formatted as Purchase[],
    rowCount: count || 0,
  };
};

// Get purchase by ID with details
export const getPurchaseById = async (id: string) => {
  const { data: purchase, error: purchaseError } = await supabase
    .from("purchases")
    .select(
      `
      *,
      suppliers:supplierid(name, phone, email),
      branches:branchid(branchName),
      users:userid(email)
    `
    )
    .eq("id", id)
    .single();

  if (purchaseError) throw new Error(purchaseError.message);

  // Obtener detalles
  const { data: details, error: detailsError } = await supabase
    .from("purchasedetails")
    .select(
      `
      *,
      products:productid(nameProd, unit)
    `
    )
    .eq("purchaseid", id);

  if (detailsError) throw new Error(detailsError.message);

  return {
    ...purchase,
    supplier_name: (purchase.suppliers as any)?.name,
    branch_name: (purchase.branches as any)?.branchName,
    user_email: (purchase.users as any)?.email,
    details: details?.map((d) => ({
      ...d,
      nameProd: (d.products as any)?.nameProd,
      unit: (d.products as any)?.unit,
    })),
  } as Purchase;
};

// Create purchase
export const createPurchase = async (
  supplierId: string,
  branchId: string,
  userId: string,
  details: PurchaseDetailInput[],
  notes?: string
) => {
  // Calcular total
  const total = details.reduce((sum, d) => sum + d.quantity * d.unitcost, 0);

  // Crear compra
  const { data: purchase, error: purchaseError } = await supabase
    .from("purchases")
    .insert({
      supplierid: supplierId,
      branchid: branchId,
      userid: userId,
      total,
      notes: notes || null,
      status: "RECEIVED",
    })
    .select()
    .single();

  if (purchaseError) throw new Error(purchaseError.message);

  // Crear detalles
  const detailsWithPurchaseId = details.map((d) => ({
    purchaseid: purchase.id,
    productid: d.productid,
    quantity: d.quantity,
    unitcost: d.unitcost,
    total: d.quantity * d.unitcost,
  }));

  const { error: detailsError } = await supabase
    .from("purchasedetails")
    .insert(detailsWithPurchaseId);

  if (detailsError) throw new Error(detailsError.message);

  // Retornar compra con detalles
  return getPurchaseById(purchase.id);
};

// Update purchase (solo status y notes, no detalles)
export const updatePurchase = async (
  id: string,
  updates: {
    status?: "PENDING" | "RECEIVED" | "CANCELLED";
    notes?: string;
  }
) => {
  const { data, error } = await supabase
    .from("purchases")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Purchase;
};

// Cancel purchase (revierte el stock via trigger)
export const cancelPurchase = async (id: string) => {
  return updatePurchase(id, { status: "CANCELLED" });
};

// Get purchase details
export const getPurchaseDetails = async (purchaseId: string) => {
  const { data, error } = await supabase
    .from("purchasedetails")
    .select(
      `
      *,
      products:productid(nameProd, unit, sku)
    `
    )
    .eq("purchaseid", purchaseId);

  if (error) throw new Error(error.message);

  return data?.map((d) => ({
    ...d,
    nameProd: (d.products as any)?.nameProd,
    unit: (d.products as any)?.unit,
    sku: (d.products as any)?.sku,
  }));
};

// Get low stock products by branch
export const getLowStockProductsByBranch = async (branchId: string) => {
  const { data, error } = await supabase
    .from("branchStocks")
    .select(
      `
      *,
      products:productId(nameProd, minstock, unit, id),
      branches:branchId(branchName)
    `
    )
    .eq("branchId", branchId)
    .lte("stock", supabase.raw("(SELECT minstock FROM products WHERE id = products.id)"));

  if (error) throw new Error(error.message);

  // Alternativa: Filtrar en frontend si la query rte anterior no funciona
  return data
    ?.map((bs) => ({
      productId: (bs.products as any)?.id,
      nameProd: (bs.products as any)?.nameProd,
      minstock: (bs.products as any)?.minstock,
      unit: (bs.products as any)?.unit,
      stock: bs.stock,
      branchId,
    }))
    .filter((item) => item.stock <= (item.minstock || 0)) as any[];
};

// Get total sales by branch and date range
export const getPurchasesByDateRange = async (
  branchId: string,
  startDate: Date,
  endDate: Date,
  supplierId?: string
) => {
  let query = supabase
    .from("purchases")
    .select(
      `
      *,
      suppliers:supplierid(name),
      branches:branchid(branchName)
    `
    )
    .eq("branchid", branchId)
    .gte("created_at", startDate.toISOString())
    .lte("created_at", endDate.toISOString());

  if (supplierId) {
    query = query.eq("supplierid", supplierId);
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) throw new Error(error.message);

  return data?.map((p) => ({
    ...p,
    supplier_name: (p.suppliers as any)?.name,
    branch_name: (p.branches as any)?.branchName,
  })) as Purchase[];
};
