import { Store } from "lucide-react";

export const EmptyBranches = () => {
  return (
    /* flex-1 y min-h-full aseguran que ocupe el espacio restante del padre */
    <div className="flex flex-1 flex-col items-center justify-center min-h-[400px] h-full w-full">
      <div className="flex max-w-[420px] flex-col items-center justify-center text-center p-8 border border-dashed rounded-lg bg-card text-card-foreground shadow-sm">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Store className="h-10 w-10 text-muted-foreground" />
        </div>

        <h3 className="mt-4 text-lg font-semibold">No hay sucursales aún</h3>

        <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-[300px] mx-auto">
          Agrega tu primera sucursal para comenzar a gestionar tu inventario y
          ventas de forma centralizada.
        </p>

        {/* Opcional: Aquí suele ir el botón de acción en shadcn */}
      </div>
    </div>
  );
};
