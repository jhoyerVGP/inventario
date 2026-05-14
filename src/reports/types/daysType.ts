//types de las cards
export interface DailyCashSummary {
  completed_sales_amount: number;
  cash_received_amount: number;
  total_discounts: number;
  total_sales_count: number;
}

export interface DebtSummary {
  total_pending_debt: number;
}

export interface StockSummary {
  low_stock_count?: number;
  out_of_stock_count?: number;
}

export interface CardsType extends DailyCashSummary, DebtSummary, StockSummary {}

//types para las graficas diarias (ejl: ultimos 7 dias)
export interface SalesDataDayMonth {
  sale_date: string;
  total_cash: number;
  total_debt: number;
  total_sold: number;
}
