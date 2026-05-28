import {
  CircleX,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
//types para el pos y la venta
import type { CartItem } from "@/types/salePos";
import styles from "./styles.module.css";

interface Props {
  cart: CartItem[];
  clearCart: () => void;
  changeByDelta: (item: CartItem, delta: number) => void;
  removeFromCart: (productId: string) => void;
  editingQty: Record<string, string>;
  setEditingQty: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  commitQuantity: (item: CartItem, rawValue: number) => void;
  totals: {
    subtotal: number;
    tax: number;
    calculatedTotal: number;
    finalAmount: number;
    difference: number;
  };
  manualAmount: number | "";
  setManualAmount: React.Dispatch<React.SetStateAction<number | "">>;
  isDebt: boolean;
  setIsDebt: React.Dispatch<React.SetStateAction<boolean>>;
  handleManualAmount: (valueI: number | "") => void;
  openModal: () => void;
  isOpenShopping: boolean;
  setIsOpenShopping: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AsidePos = ({
  cart,
  clearCart,
  changeByDelta,
  removeFromCart,
  editingQty,
  setEditingQty,
  commitQuantity,
  setIsDebt,
  setManualAmount,
  openModal,
  isOpenShopping,
  setIsOpenShopping,
}: Props) => {
  return (
    <aside
      className={`
        ${styles.saleCartContent} 
        ${isOpenShopping ? "flex" : "hidden"} lg:flex flex-col bg-card border-l border-border select-none h-full shadow-lg
      `}
    >
      {/* Encabezado del Panel de Control */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <div className="px-4 py-3.5 border-b border-border flex justify-between items-center bg-card shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsOpenShopping(!isOpenShopping)}
              className="lg:hidden p-1 rounded-md hover:bg-muted transition-colors cursor-pointer"
            >
              <CircleX
                className="text-muted-foreground hover:text-foreground transition-colors"
                size={22}
              />
            </button>
            <h2 className="text-base font-title font-bold flex items-center gap-2 text-foreground tracking-tight">
              <ShoppingCart
                className="text-brand"
                size={20}
                strokeWidth={2.5}
              />
              <span>Orden actual</span>
            </h2>
          </div>

          <button
            onClick={() => {
              clearCart();
              setManualAmount("");
              setIsDebt(false);
            }}
            disabled={cart.length === 0}
            className="p-2 text-muted-foreground hover:text-btn-cancel hover:bg-btn-cancel/10 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            title="Vaciar carrito"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Zona de Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar bg-background-view/40">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center p-6 animate-fade-in">
              <div className="p-4 bg-muted/40 rounded-full mb-3 border border-border/40">
                <Package
                  size={40}
                  strokeWidth={1.5}
                  className="text-muted-foreground/60"
                />
              </div>
              <p className="text-xs font-title font-medium text-muted-foreground/80">
                El carrito está vacío
              </p>
              <p className="text-[11px] text-muted-foreground/50 mt-0.5">
                Agrega productos desde el catálogo
              </p>
            </div>
          ) : (
            cart.map((item, i) => (
              <div
                key={`section-car-item-pos-${item.id}`}
                className="flex flex-col w-full gap-3 p-3 rounded-xl border border-border bg-card shadow-xs hover:border-border/80 transition-all duration-200"
              >
                {/* Línea Superior: Imagen, Detalles e Índice */}
                <div className="flex w-full gap-2.5 items-center min-w-0">
                  <div className="text-[10px] font-mono font-bold text-muted-foreground/40 w-4 shrink-0 text-center">
                    {(i + 1).toString().padStart(2, "0")}
                  </div>
                  <div className="size-12 rounded-lg overflow-hidden border border-border/60 bg-muted/20 shrink-0">
                    <img
                      src={item.main_image || "/placeholder.png"}
                      className="w-full h-full object-cover"
                      alt={item.name_prod}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-title font-semibold text-foreground truncate leading-snug">
                      {item.name_prod}
                    </h4>
                    <span className="text-[11px] text-muted-foreground font-body font-medium block mt-0.5">
                      Precio u. : $
                      {item.is_offer_active ? item.price_offer : item.price}
                    </span>
                  </div>
                </div>

                {/* Línea Inferior: Subtotal, Controles Numéricos y Borrado */}
                <div className="flex justify-between w-full items-center pt-2 border-t border-border/40">
                  <div className="text-xs font-title font-bold text-foreground">
                    ${item.subtotal.toFixed(2)}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Stepper de Cantidad */}
                    <div className="flex gap-1 items-center bg-muted/40 border border-border/80 rounded-lg p-0.5 shadow-inner">
                      <button
                        onClick={() => changeByDelta(item, -1)}
                        className="p-1 text-muted-foreground hover:text-foreground hover:bg-background rounded-md transition-all cursor-pointer active:scale-90"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>

                      <input
                        type="number"
                        value={editingQty[item.id] ?? item.quantity}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw === "") {
                            setEditingQty((prev) => ({
                              ...prev,
                              [item.id]: "",
                            }));
                            return;
                          }
                          if (!/^\d+$/.test(raw)) return;
                          if (raw.length > 1 && raw.startsWith("0")) return;

                          setEditingQty((prev) => ({
                            ...prev,
                            [item.id]: raw,
                          }));
                        }}
                        onBlur={() => {
                          const raw = editingQty[item.id];
                          if (!raw) {
                            setEditingQty((prev) => {
                              const copy = { ...prev };
                              delete copy[item.id];
                              return copy;
                            });
                            return;
                          }
                          commitQuantity(item, Number(raw));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.currentTarget.blur();
                          }
                        }}
                        className="w-11 text-center font-body text-xs font-bold text-foreground bg-transparent border-0 focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />

                      <button
                        onClick={() => changeByDelta(item, 1)}
                        className="p-1 text-muted-foreground hover:text-foreground hover:bg-background rounded-md transition-all cursor-pointer active:scale-90"
                      >
                        <Plus size={12} strokeWidth={3} />
                      </button>
                    </div>

                    {/* Botón Eliminar Fila Única */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-muted-foreground hover:text-btn-cancel hover:bg-btn-cancel/10 rounded-md transition-colors cursor-pointer"
                      title="Eliminar artículo"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Fijo: Botón de Procesamiento de Venta */}
      <div className="p-3 border-t border-border bg-card shrink-0">
        <button
          onClick={openModal}
          disabled={cart.length === 0}
          className={`w-full py-3 bg-btn-process text-btn-process-foreground rounded-xl text-sm font-title font-bold tracking-wide transition-all duration-200 shadow-sm border border-btn-process-hover/20 ${
            cart.length === 0
              ? "opacity-40 cursor-not-allowed shadow-none"
              : "hover:bg-btn-process-hover hover:shadow-md active:scale-[0.99] cursor-pointer"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            Procesar Venta
          </span>
        </button>
      </div>
    </aside>
  );
};
