export interface PurchaseDetail {
  purchaseid: string;
  productid: string;
  quantity: number;
  unitcost: number;
  total: number;
  created_at: string;
  // Campos agregados para UI
  nameProd?: string;
  unit?: string;
}

export interface Purchase {
  id: string;
  supplierid: string;
  branchid: string;
  userid: string;
  total: number;
  notes?: string;
  status: 'PENDING' | 'RECEIVED' | 'CANCELLED';
  created_at: string;
  updated_at: string;
  // Campos agregados
  supplier_name?: string;
  branch_name?: string;
  user_email?: string;
  details?: PurchaseDetail[];
}

export interface PurchaseDetailInput {
  productid: string;
  quantity: number;
  unitcost: number;
}

export interface PurchaseType {
  supplierid: string;
  branchid: string;
  notes?: string;
  details: PurchaseDetailInput[];
}

export interface PurchaseDetailFormRow {
  productid: string;
  quantity: number;
  unitcost: number;
  subtotal?: number;
}
