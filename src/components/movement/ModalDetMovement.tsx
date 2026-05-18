import { type Movement } from "@/types/movement";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { getBranchName } from "@/utils/movement";
import type { JSX } from "react";
import { formatDate } from "@/utils/dataFormat";

interface MovementDialogProps {
  movement: Movement;
  isOpen?: boolean;
  onClose?: () => void;
}

export function ModalDetMovement({
  movement,
  isOpen,
  onClose,
}: MovementDialogProps) {
  if (!movement) return null;

  const {
    type,
    employee_name,
    name_prod,
    movedQuantity,
    branch_from_name,
    branch_to_name,
    created_at,
    description,
  } = movement;

  // Mantenemos la lógica de tipos para mostrarlo como texto
  const typeConfig: Record<string, string> = {
    INCOMING: "Entrada de Inventario",
    OUTGOING: "Salida de Inventario",
    TRANSFER: "Transferencia",
    ADJUST: "Ajuste",
  };

  const movementTypeLabel = typeConfig[type] || type;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-card border-border shadow-lg sm:rounded-xl overflow-hidden font-body">
        {/* Header - Limpio con borde inferior */}
        <div className="px-6 py-4 border-b border-border bg-card flex items-center justify-between">
          <DialogTitle className="font-title text-lg font-bold text-foreground">
            Detalle de Movimiento
          </DialogTitle>
          {/* El botón "X" por defecto de shadcn se posicionará aquí automáticamente si no lo has modificado. 
              Si necesitas uno explícito, puedes agregarlo con DialogClose */}
        </div>

        {/* Contenido principal */}
        <div className="p-6">
          {/* Grilla de información general */}
          <div className="grid grid-cols-2 gap-y-5 gap-x-4 mb-6">
            <div>
              <p className="text-[13px] text-muted-foreground mb-1">
                Tipo de movimiento
              </p>
              <p className="text-sm font-medium text-foreground">
                {movementTypeLabel}
              </p>
            </div>

            <div>
              <p className="text-[13px] text-muted-foreground mb-1">Sucursal</p>
              <p className="text-sm font-medium text-foreground">
                {getBranchName(type, branch_from_name, branch_to_name)}
              </p>
            </div>

            <div>
              <p className="text-[13px] text-muted-foreground mb-1">Empleado</p>
              <p className="text-sm font-medium text-foreground">
                {employee_name}
              </p>
            </div>

            <div>
              <p className="text-[13px] text-muted-foreground mb-1">Fecha</p>
              <p className="text-sm font-medium text-foreground">
                {formatDate(created_at)}
              </p>
            </div>
          </div>

          {/* Sección de Notas */}
          {description && (
            <div className="mb-6">
              <p className="text-[13px] text-muted-foreground mb-1">Notas</p>
              <p className="text-sm text-foreground">{description}</p>
            </div>
          )}

          {/* "Tabla" de Producto imitando el estilo de la imagen */}
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            {/* Cabecera de la tabla */}
            <div className="grid grid-cols-[1fr_auto] gap-4 px-4 py-3 border-b border-border">
              <span className="text-sm font-medium text-muted-foreground">
                Producto
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                Cant.
              </span>
            </div>

            {/* Fila del producto */}
            <div className="grid grid-cols-[1fr_auto] gap-4 px-4 py-4 items-center">
              <span className="text-sm text-foreground">{name_prod}</span>
              <span className="text-sm font-medium text-foreground">
                {movedQuantity}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
