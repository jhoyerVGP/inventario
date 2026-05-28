import {
  User,
  CreditCard,
  Building2,
  Calendar,
  DollarSign,
  Tag,
  Package,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/dataFormat";
import type { SaleH } from "@/types/saleh";
import { getPaymentMethod, getStatusBadge } from "../ModalDetSale";

interface Props {
  sale: SaleH;
  products?: any[];
  isLoadingProducts?: boolean;
}

export const Content = ({ sale, products = [], isLoadingProducts = false }: Props) => {
  return (
    <div className="space-y-6">
      {/* Estado Centrado */}
      <div className="flex flex-col items-center justify-center space-y-2 pb-2">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
          Estado Operativo
        </span>
        {getStatusBadge(sale.status)}
      </div>

      {/* Información del Cliente */}
      <div className="space-y-2.5">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          Información del Cliente
        </h3>
        <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border/60">
          <div>
            <p className="text-[11px] text-muted-foreground mb-1">
              Nombre o Razón Social
            </p>
            <p className="text-sm font-semibold text-foreground">
              {sale.clientName || "Consumidor Final"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground mb-1">NIT / CI</p>
            <p className="text-sm font-semibold text-foreground">
              {sale.clientNit || "S/N"}
            </p>
          </div>
        </div>
      </div>

      {/* Productos Adquiridos */}
      <div className="space-y-2.5">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5" />
          Productos Adquiridos
        </h3>
        <div className="bg-background rounded-xl p-4 border border-border shadow-sm space-y-3">
          {isLoadingProducts ? (
            <div className="flex justify-center p-4">
              <span className="text-xs text-muted-foreground animate-pulse">Cargando productos...</span>
            </div>
          ) : products && products.length > 0 ? (
            <div className="space-y-3">
              {products.map((p, i) => (
                <div key={i} className="flex justify-between items-start border-b border-border/50 pb-3 last:border-0 last:pb-0">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-foreground line-clamp-1 leading-none">{p.name}</span>
                    <span className="text-xs font-medium text-muted-foreground">
                      {p.quantity} x {formatCurrency(p.unitPrice)}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-foreground">
                    {formatCurrency(p.total)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 text-xs font-medium text-muted-foreground">
              No hay productos registrados
            </div>
          )}
        </div>
      </div>

      {/* Liquidación Financiera */}
      <div className="space-y-2.5">
        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5" />
          Liquidación Financiera
        </h3>
        <div className="bg-background rounded-xl p-4 space-y-3 border border-border shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Subtotal Original
            </span>
            <span className="text-sm font-semibold text-foreground">
              {formatCurrency(sale.totalAmount)}
            </span>
          </div>

          {sale.discountAmount > 0 && (
            <div className="flex justify-between items-center text-destructive">
              <span className="text-sm flex items-center gap-1.5 font-medium">
                <Tag className="w-3.5 h-3.5" />
                Descuento
              </span>
              <span className="text-sm font-bold">
                -{formatCurrency(sale.discountAmount)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center pt-3 border-t border-border/60 mt-1">
            <span className="text-sm font-bold text-foreground">
              Total Cobrado
            </span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {formatCurrency(sale.finalAmount)}
            </span>
          </div>

          {sale.debtAmount > 0 && (
            <div className="flex justify-between items-center pt-2 mt-1">
              <span className="text-xs text-amber-600 dark:text-amber-500 font-medium">
                Saldo Pendiente
              </span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-500">
                {formatCurrency(sale.debtAmount)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Metadatos (Grilla inferior) */}
      <div className="grid grid-cols-2 gap-y-5 gap-x-4 pt-2">
        <div>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mb-1">
            <CreditCard className="w-3.5 h-3.5" />
            Método de Pago
          </p>
          <p className="text-sm font-semibold text-foreground capitalize">
            {getPaymentMethod(sale.paymentMethod || (sale as any).payment_method || "CASH")}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mb-1">
            <Building2 className="w-3.5 h-3.5" />
            Sucursal
          </p>
          <p className="text-sm font-semibold text-foreground">
            {sale.branch_name || "Centro"}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5" />
            Fecha de Emisión
          </p>
          <p className="text-sm font-semibold text-foreground leading-tight">
            {formatDate(sale.created_at)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mb-1">
            <User className="w-3.5 h-3.5" />
            Vendedor
          </p>
          <p className="text-sm font-semibold text-foreground">
            {sale.employee_name || "Caja Principal"}
          </p>
        </div>
      </div>
    </div>
  );
};
