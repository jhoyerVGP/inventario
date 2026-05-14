import { supabase } from "@/api/supabaseClient";
import type { Supplier, SupplierType } from "@/types/supplier";
import type { TableParams } from "@/components/common/tabla/api";

// Get all active suppliers
export const getSuppliers = async (params: TableParams) => {
  const from = (params.pageIndex - 1) * params.pageSize;
  const to = from + params.pageSize - 1;

  let query = supabase
    .from("suppliers")
    .select("*", { count: "exact" })
    .eq("activo", true)
    .is("deleted_at", null);

  // Aplicar filtro de búsqueda si existe
  if (params.globalFilter) {
    query = query.or(
      `name.ilike.%${params.globalFilter}%,email.ilike.%${params.globalFilter}%,phone.ilike.%${params.globalFilter}%`
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

  return {
    data: data as Supplier[],
    rowCount: count || 0,
  };
};

// Get supplier by ID
export const getSupplierById = async (id: string) => {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as Supplier;
};

// Create supplier
export const createSupplier = async (supplier: SupplierType) => {
  // Validar no duplicados
  const { data: existing, error: checkError } = await supabase
    .from("suppliers")
    .select("id")
    .eq("name", supplier.name)
    .eq("activo", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (checkError) throw new Error(checkError.message);
  if (existing) throw new Error("Este proveedor ya existe");

  const { data, error } = await supabase
    .from("suppliers")
    .insert({
      name: supplier.name,
      phone: supplier.phone || null,
      address: supplier.address || null,
      email: supplier.email || null,
      notes: supplier.notes || null,
      activo: supplier.activo !== false,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Supplier;
};

// Update supplier
export const updateSupplier = async (id: string, supplier: SupplierType) => {
  const { data, error } = await supabase
    .from("suppliers")
    .update({
      name: supplier.name,
      phone: supplier.phone || null,
      address: supplier.address || null,
      email: supplier.email || null,
      notes: supplier.notes || null,
      activo: supplier.activo,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Supplier;
};

// Soft delete supplier
export const deleteSupplier = async (id: string) => {
  const { error } = await supabase
    .from("suppliers")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
};

// Toggle supplier active status
export const toggleSupplierStatus = async (id: string, active: boolean) => {
  const { data, error } = await supabase
    .from("suppliers")
    .update({ activo: active, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Supplier;
};
