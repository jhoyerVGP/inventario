export interface Supplier {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  notes?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface SupplierType {
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  notes?: string;
  activo?: boolean;
}
