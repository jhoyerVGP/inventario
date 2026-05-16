// Tipo que refleja EXACTAMENTE lo que Supabase retorna en el select de lista
export interface PurchaseRow {
  id: string;
  total: number;
  status: "DRAFT" | "CONFIRMED";
  notes: string | null;
  created_at: string;
  updated_at: string;
  supplierid: string | null;
  branchid: string;
  userid: string;
  suppliers: { name: string } | null;
  branches: { branchName: string } | null;
  users: { employees: { name: string } | null } | null;
}

export interface PurchaseDetail {
  productid: string;
  quantity: number;
  unitcost: number;
  total: number;
  products: { nameProd: string; sku: string | null } | null;
}

export interface PurchaseWithDetails {
  id: string;
  total: number;
  status: "DRAFT" | "CONFIRMED";
  notes: string | null;
  created_at: string;
  updated_at: string;
  supplierid: string | null;
  branchid: string;
  userid: string;
  suppliers: { name: string } | null;
  branches: { branchName: string } | null;
  users: { employees: { name: string } | null } | null;
  purchasedetails: PurchaseDetail[];
}

// Para las filas del formulario de creación
export interface PurchaseFormRow {
  productId: string;
  productName: string;
  currentStock: number;
  quantity: number;
  unitCost: number;
}
