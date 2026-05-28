//types para el pos y la venta
import type { ProductPos } from "@/types/salePos";
import { Loader2, Plus } from "lucide-react";
import styles from "@/components/Pos/styles.module.css";
import { validateOffer } from "@/lib/pos/validators";
import { justDate } from "@/utils/dataFormat";
import Error from "../common/Error";

interface Props {
  addToCart: (product: ProductPos) => void;
  products: ProductPos[];
  isPending: boolean;
  isError: boolean;
  loadMore: () => void;
  getAvailableStock: (productId: string) => number;
}

export const ProductsPos = ({
  products,
  addToCart,
  isPending,
  isError,
  getAvailableStock,
}: Props) => {
  return (
    <div className="flex-1 max-h-full h-full w-full pt-4 px-3 mb-14 md:mb-4 overflow-y-auto scroll-smooth xl:px-8 custom-scrollbar">
      {isPending && products.length === 0 ? (
        <div className="flex flex-col gap-3 justify-center items-center h-72 text-muted-foreground font-body text-sm animate-pulse">
          <Loader2 className="animate-spin text-brand" size={28} />
          <span>Cargando catálogo premium...</span>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={`${styles.productsContent} gap-3 md:gap-4`}>
            {products.map((prod) => {
              const isValidOffer =
                prod.is_offer_active &&
                validateOffer(
                  justDate(prod.start_date),
                  justDate(prod.end_date),
                );

              const currentStock = getAvailableStock(prod.id);
              const isOutOfStock = currentStock <= 0;

              return (
                <div
                  key={`section-show-product-pos-${prod.id}`}
                  className="bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:border-brand hover:shadow-md hover:shadow-brand/5 flex flex-col group select-none relative"
                >
                  {/* Contenedor de Imagen y Badges */}
                  <div className="aspect-square bg-muted/10 relative overflow-hidden border-b border-border/40 shrink-0">
                    <img
                      src={prod.main_image || "/placeholder.png"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      alt={prod.name_prod}
                      loading="lazy"
                    />

                    {/* Badge de Oferta o Precio Flotante (Limpio y sin bloques negros puros) */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none drop-shadow-xs">
                      {isValidOffer ? (
                        <div className="flex flex-col items-start bg-background/95 backdrop-blur-md px-2 py-1 rounded-md border border-destructive/20 shadow-xs">
                          <span className="text-[10px] line-through text-destructive font-medium leading-none mb-0.5">
                            ${prod.price}
                          </span>
                          <span className="text-xs font-bold text-foreground leading-none">
                            ${prod.price_offer}
                          </span>
                        </div>
                      ) : (
                        <div className="bg-background/95 backdrop-blur-md px-2 py-1.5 rounded-md border border-border/80 shadow-xs">
                          <span className="text-xs font-bold text-foreground leading-none">
                            ${prod.price}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Botón de Acción Separado en la Esquina Superior Derecha para evitar colisiones */}
                    <div className="absolute top-2 right-2 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isOutOfStock) addToCart(prod);
                        }}
                        disabled={isOutOfStock}
                        className={`size-8 rounded-lg flex items-center justify-center text-brand-foreground font-bold transition-all duration-200 shadow-sm border border-brand/20 active:scale-95 ${
                          isOutOfStock
                            ? "bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50"
                            : "bg-brand hover:bg-brand-hover-dark lg:opacity-0 group-hover:opacity-100 cursor-pointer"
                        }`}
                        title={
                          isOutOfStock ? "Sin Stock" : "Agregar al carrito"
                        }
                      >
                        <Plus size={16} strokeWidth={2.5} />
                      </button>
                    </div>

                    {/* Badge de Stock de Diseño Minimalista */}
                    <div
                      className={`absolute bottom-2 right-2 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono font-medium border shadow-xs ${
                        isOutOfStock
                          ? "bg-destructive/10 text-destructive border-destructive/20"
                          : "bg-background/80 text-muted-foreground border-border/60"
                      }`}
                    >
                      Stock: {currentStock}
                    </div>
                  </div>

                  {/* Cuerpo de Información del Producto */}
                  <div className="p-3 flex flex-col flex-1 bg-card justify-between min-h-0">
                    <div className="flex flex-col flex-1 min-h-0">
                      <span className="text-[10px] text-muted-foreground font-mono tracking-wider uppercase truncate">
                        {prod.sku || "SIN SKU"}
                      </span>
                      <h3 className="text-xs sm:text-sm font-title font-medium text-foreground line-clamp-2 mt-1 leading-snug flex-1">
                        {prod.name_prod}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isError && (
        <div className="mt-4">
          <Error />
        </div>
      )}
    </div>
  );
};
