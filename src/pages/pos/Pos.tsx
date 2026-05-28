import { useState } from "react";
//branch context
import { useBranch } from "@/context/BranchContext";
//user context
import { useAuth } from "@/context/AuthContext";
//hook de categorias get
import { useGetCatForSale } from "@/hooks/category/useGetCatForSale";
//componentes del pos
import { HeaderPos } from "@/components/Pos/HeaderPos";
import { ProductsPos } from "@/components/Pos/ProductsPos";
import { CircleAlert } from "lucide-react";
import { AsidePos } from "@/components/Pos/AsidePos";
import { useProducts } from "@/hooks/pos/hookslogic/useProducts";
import { ModalPosE } from "@/components/Pos/ModalPosE";
//types para el pos y la venta
import type { SaleInput, CartItem } from "@/types/salePos";
import type { SaleFormValues } from "@/schemes/saleExecute";
//hook para crrear la venta
import { useCreateSale } from "@/hooks/pos/useCreateSale";
import { toast } from "sonner";
import { usePosCart } from "@/hooks/pos/hookslogic/usePosCart";

export type EditingQtyMap = Record<string, string>;

const Pos = () => {
  //usamos el context de sucursal
  const { currentBranch } = useBranch();
  //usamos el context del userAuth
  const { user } = useAuth();
  //usamos el hook de traer las categorias
  const { data: categories } = useGetCatForSale();
  //estados locales para el componente
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const LIMIT = 20;

  //USAMOS EL HOOK USECART
  const cartLogicPos = usePosCart();
  //USAMOS EL HOOK DEL PRODUCTOS
  const productsLogic = useProducts({
    currentBranch,
    category,
    search,
    LIMIT,
    cart: cartLogicPos.cart,
  });

  //estado del modal de finalizar venta
  const [isModalOpen, setIsModalOpen] = useState(false);
  //estado para el carrito de ventas
  const [isOpenShopping, setIsOpenShopping] = useState(false);
  //hook para crear la venta
  const createSaleMutation = useCreateSale();
  //FUNCION PARA EJECUTAR VENTA
  const executeSale = (carts: CartItem[], dataF: SaleFormValues) => {
    //primero que nada refinar los datos
    const prodRef = carts.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      unitPrice:
        item.is_offer_active && item.price_offer
          ? item.price_offer
          : item.price,
      totalPrice: item.subtotal,
    }));
    //calculamos la deuda
    const deb = dataF.totalCobrado - dataF.montoRecibido!;
    const numDeb = Number(deb.toFixed(2));

    const datosE: SaleInput = {
      branchId: currentBranch!,
      userId: user!.id,
      clientName: dataF.name,
      clientNit: dataF.idNit!,
      paymentMethod: dataF.paymentMethod!,
      status: dataF.status!,
      totalAmount: dataF.totalReal,
      discountAmount: dataF.totalReal - dataF.totalCobrado,
      finalAmount: dataF.totalCobrado,
      debtAmount: dataF.hayDeuda ? numDeb : 0,
      products: prodRef,
    };
    const promise = createSaleMutation.mutateAsync(datosE);
    toast.promise(promise, {
      loading: "Procesando venta...",
      success: "Venta realizada con exito!",
      error: (err) => `Error al procesar la venta: ${err.message}`,
      position: "top-right",
      duration: 4000,
    });
    cartLogicPos.clearCart(); // Limpiar el carrito después de la venta
    cartLogicPos.setManualAmount("");
    cartLogicPos.setIsDebt(false);
  };

  if (!currentBranch) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-6 p-10">
        <CircleAlert className="size-20 text-destructive" />
        <h2 className="text-center text-3xl font-bold text-foreground max-w-2xl">
          Seleccione una sucursal para comenzar la venta.
        </h2>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-background">
      {/* PANEL IZQUIERDO: CATÁLOGO */}
      <section className="flex-1 h-full flex flex-col min-w-0 relative overflow-y-auto w-full">
        {/* buscador + categorias */}
        <HeaderPos
          setSearch={setSearch}
          search={search}
          categories={categories || []}
          category={category}
          setCategory={setCategory}
          isOpenShopping={isOpenShopping}
          setIsOpenShopping={setIsOpenShopping}
        />

        {/* Grid de Productos */}
        <ProductsPos addToCart={cartLogicPos.addToCart} {...productsLogic} />
      </section>

      {/* PANEL DERECHO: CARRITO */}
      <AsidePos
        {...cartLogicPos}
        openModal={() => setIsModalOpen(true)}
        isOpenShopping={isOpenShopping}
        setIsOpenShopping={setIsOpenShopping}
      />

      {/* modal de Finalizar Venta */}
      <ModalPosE
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        carts={cartLogicPos.cart}
        totals={cartLogicPos.totals}
        executeSale={executeSale}
      />
    </div>
  );
};

export default Pos;
