import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormSupplier } from "@/components/FormSupplier";
import type { Supplier } from "@/types/supplier";
import type { SupplierFormOutput } from "@/schemes/supplier";

interface ModalSupplierProps {
  isOpen: boolean;
  setOpen: () => void;
  onSubmit: (data: SupplierFormOutput) => Promise<void>;
  initialData?: Supplier | null;
  isLoading?: boolean;
}

export const ModalSupplier = ({
  isOpen,
  setOpen,
  onSubmit,
  initialData,
  isLoading = false,
}: ModalSupplierProps) => {
  const isEdit = Boolean(initialData);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[520px] card-modal">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Actualizar proveedor" : "Crear nuevo proveedor"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Actualiza la información del proveedor."
              : "Complete el formulario para crear un nuevo proveedor."}
          </DialogDescription>
        </DialogHeader>

        <FormSupplier initialData={initialData || undefined} onSubmit={onSubmit} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button type="submit" form="form-supplier" disabled={isLoading}>
            {isLoading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
