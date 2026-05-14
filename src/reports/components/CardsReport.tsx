import { BanknoteX, DollarSign, ShoppingCart, Wallet, AlertCircle, Box } from "lucide-react";
import { MetricCard } from "./MetricCard";
import type { CardsType } from "../types/daysType";

//para cantidades monetarias
const formatCurrency = (value: number) => {
  return `Bs ${value.toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
//para numeros enteros
const formatNumber = (value: number) => {
  return value.toLocaleString("es-BO");
};

export const CardsReport = ({ data }: { data: CardsType }) => {
  return (
    <div className="h-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        {/* Cards Grid */}
        <div className="cards-grid">
          {/* monto total recibido del dia)*/}
          <MetricCard
            title="Monto Total Recibido hoy"
            value={formatCurrency(data.cash_received_amount)}
            subtitle="vs dia anterior"
            percentage="+2.5%"
            isPositive={true}
            colorScheme="cardNormal"
            icon={DollarSign}
          />

          {/* Monto total descuentos aplicados del dia */}
          <MetricCard
            title="Total descuentos aplicados hoy"
            value={formatCurrency(data.total_discounts)}
            subtitle="vs dia anterior"
            percentage="+7.9%"
            isPositive={true}
            colorScheme="cardNormal"
            smallValue="2%"
            icon={Wallet}
          />

          {/* Total de ventas completadas del dia */}
          <MetricCard
            title="Total ventas realizadas hoy"
            value={formatNumber(data.total_sales_count)}
            subtitle="vs dia anterior"
            percentage="+15.6%"
            isPositive={true}
            colorScheme="cardNormal"
            icon={ShoppingCart}
          />

          {/* Total de descuentos del dia */}
          <MetricCard
            title="Deuda total pendiente general  "
            value={formatCurrency(data.total_pending_debt)}
            subtitle=""
            percentage="-3.2%"
            isPositive={false}
            colorScheme="cardDebt"
            icon={BanknoteX}
          />

          {/* Stock bajo */}
          <MetricCard
            title="Productos con stock bajo"
            value={formatNumber((data as any).low_stock_count || 0)}
            subtitle="requieren reorden"
            percentage=""
            isPositive={false}
            colorScheme="cardNormal"
            icon={AlertCircle}
          />

          {/* Agotados */}
          <MetricCard
            title="Productos agotados"
            value={formatNumber((data as any).out_of_stock_count || 0)}
            subtitle="acción inmediata"
            percentage=""
            isPositive={false}
            colorScheme="cardDebt"
            icon={Box}
          />
        </div>
      </div>
    </div>
  );
};
