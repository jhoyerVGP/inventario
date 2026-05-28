import { MapPin, Users, Building2, Calendar, Box, Hash } from "lucide-react";
import { DropDownAction } from "@/components/common/DropDownAction";
import type { BranchOutput } from "@/types/branch";
import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/utils/dataFormat"; // Usando tu utilitario de fechas para consistencia
import "@/components/branch/stylesBranches.css";

interface Props {
  branches: BranchOutput[] | undefined;
  setBranchS: React.Dispatch<React.SetStateAction<BranchOutput | undefined>>;
  handleOpenModal: () => void;
  handleOpenAlertDelete: () => void;
}

export const Branches = ({
  branches,
  setBranchS,
  handleOpenModal,
  handleOpenAlertDelete,
}: Props) => {
  return (
    <div className="container-branches w-full">
      {/* Grid de sucursales adaptativo */}
      <div className="branches-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {branches?.map((sucursal) => (
          <div
            key={sucursal.id}
            className="group rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-200 flex flex-col justify-between overflow-hidden"
          >
            {/* 1. CARD HEADER */}
            <div className="flex items-center justify-between gap-3 p-4 pb-3 border-b border-border/40">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Icono con fondo sutil y adaptativo */}
                <div className="p-2 rounded-lg text-primary bg-primary/10 dark:bg-primary/15 shrink-0 transition-colors group-hover:bg-primary/15">
                  <Building2 size={16} className="stroke-[2.5]" />
                </div>

                <div className="min-w-0 flex flex-col">
                  <h3 className="font-title text-sm font-bold tracking-tight text-foreground truncate">
                    {sucursal.branch_name}
                  </h3>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-0.5 mt-0.5">
                    <Hash size={10} /> {sucursal.code}
                  </span>
                </div>
              </div>

              {/* Botón de acción con estilo limpio tipo Ghost */}
              <div className="relative rounded-md flex items-center bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-border/50">
                <DropDownAction
                  items={[
                    {
                      label: "Actualizar información",
                      action: () => {
                        setBranchS(sucursal);
                        handleOpenModal();
                      },
                      icon: Pencil,
                    },
                    {
                      label: "Eliminar sucursal",
                      action: () => {
                        setBranchS(sucursal);
                        handleOpenAlertDelete();
                      },
                      icon: Trash2,
                    },
                  ]}
                />
              </div>
            </div>

            {/* 2. CARD BODY (Ubicación con altura mínima controlada) */}
            <div className="p-4 py-3.5 flex-1 flex items-start">
              <div className="flex items-start gap-2 text-xs text-muted-foreground w-full bg-muted/30 dark:bg-muted/10 p-3 rounded-lg border border-border/40">
                <MapPin size={14} className="mt-0.5 shrink-0 text-primary/70" />
                <span className="line-clamp-2 font-medium leading-relaxed text-foreground/80">
                  {sucursal.address || "Dirección no especificada"}
                </span>
              </div>
            </div>

            {/* 3. FOOTER METADATA (Métricas organizadas en una grilla simétrica) */}
            <div className="p-4 pt-2 bg-muted/40 dark:bg-muted/20 border-t border-border/50 grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users size={13} className="text-muted-foreground/70" />
                <span className="font-medium">
                  <strong className="text-foreground">
                    {sucursal.total_employees || 0}
                  </strong>{" "}
                  empleados
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground justify-end md:justify-start">
                <Box size={13} className="text-muted-foreground/70" />
                <span className="font-medium">
                  <strong className="text-foreground">
                    {sucursal.total_products || 0}
                  </strong>{" "}
                  productos
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground col-span-2 pt-2 border-t border-border/40 text-[11px]">
                <Calendar size={13} className="text-muted-foreground/60" />
                <span className="text-muted-foreground/80">
                  Registrado el{" "}
                  {formatDate
                    ? formatDate(sucursal.created_at)
                    : new Date(sucursal.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
