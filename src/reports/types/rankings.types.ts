export interface TopProduct {
  id: string
  title: string
  subtitle: string
  image: string | null
  amount: number
  revenue: number
}

export interface TopBranch {
  id: string
  title: string
  subtitle: string
  amount: number
  sales_count: number
}

export interface TopProfitProduct {
  id: string
  title: string
  subtitle: string
  profit: number
  revenue: number
  margin_pct: number
}