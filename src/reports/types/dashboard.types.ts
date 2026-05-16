export interface DashboardKpis {
  total_sales: number;
  yesterday_sales: number;
  sales_change_pct: number;
  sales_trend: "up" | "down" | "neutral" | "new";
  cash_received: number;
  total_discounts: number;
  total_debt: number;
  sales_count: number;
  avg_ticket: number;
  yesterday_avg_ticket: number;
  ticket_change_pct: number;
  total_units_sold: number;
  approx_profit: number;
  low_stock_count: number;
  out_of_stock_count: number;
}

export interface SalesHistoryPoint {
  sale_date: string;
  total_sold: number;
  total_cash: number;
  total_debt: number;
}

export interface HourlyPoint {
  hour_of_day: number;
  sales_count: number;
  total_amount: number;
}

export interface PaymentMethod {
  method: string;
  sales_count: number;
  total_amount: number;
  percentage: number;
}
