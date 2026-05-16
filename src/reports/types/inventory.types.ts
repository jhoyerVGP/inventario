export interface LowStockProduct {
  product_id: string;
  product_name: string;
  sku: string;
  branch_id: string;
  branch_name: string;
  current_stock: number;
  min_stock: number;
  deficit: number;
  severity: "critical" | "low";
}
