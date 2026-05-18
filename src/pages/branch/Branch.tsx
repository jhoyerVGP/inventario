import { useState } from "react";
import { Plus } from "lucide-react";
// Importamos el modal (asegúrate que la ruta sea correcta)
import { ModalAddBranch } from "@/components/branch/ModalAddBranch";
// Importamos el hook y tipos (asegúrate que la ruta sea correcta)
import { useCreateBranch } from "@/hooks/branch/useCreateBranch";
//import el hook de obtención de sucursales
import { useGetBranches } from "@/hooks/branch/useGetBranches";
import type { BranchInput, BranchOutput } from "@/types/branch";
import { Button } from "@/components/ui/button";
import { useUpdateBranch } from "@/hooks/branch/useUpdateBranch";
import { toast } from "sonner";
import { useDeleteBranch } from "@/hooks/branch/useDeleteBranch";
import { AlertDelete } from "@/components/common/AlertDelet";
//context de la surcursal
import { useBranch } from "@/context/BranchContext";
import { Branches } from "@/components/branch/Branches";
import Error from "@/components/common/Error";
import { EmptyBranches } from "@/components/branch/EmptyBranches";
import { SkeletonBranches } from "@/components/branch/SkeletonBranches";

const Branch = () => {
  //context sucursal
  const { setBranchId, currentBranch } = useBranch();
  //hook de obtención de sucursales
  const { data: branches, isLoading, isError } = useGetBranches();
  //logica para delete y update
  const [branchS, setBranchS] = useState<BranchOutput | undefined>(undefined);
  // Lógica del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Función para abrir/cerrar el modal y resetear los valores
  const handleOpenModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Hook de creación y actualización de sucursales
  const create = useCreateBranch();
  const update = useUpdateBranch();
  // Función onSubmit que maneja tanto creación como actualización con disparo del sonner toast
  const onSubmit = async (data: BranchInput) => {
    //Determinar qué promesa ejecutar
    const promise = !branchS
      ? create.mutateAsync(data) // Retorna la promesa de creación
      : update.mutateAsync({
          id: branchS.id,
          dataBranch: data,
          code: data.code,
        }); // Retorna la promesa de actualizacións
    try {
      //Envolver la promesa con toast.promise
      await toast.promise(promise, {
        loading: "Guardando datos...",
        success: () => {
          return `${
            !branchS ? "Sucursal Creada" : "Sucursal Actualizada"
          } con éxito.`;
        },
        error: (err) => {
          return `Fallo: ${err.message || "Error desconocido"}`;
        },
        position: "top-right",
        duration: 4000,
      });
      setIsModalOpen(false);
    } catch (error) {
      //Si la promesa falla, el catch se ejecuta.
      console.error("Error capturado después de la mutación:", error);
    }
  };

  //estado de la alerta de eliminación
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const handleOpenAlertDelete = () => {
    setIsOpenDelete(!isOpenDelete);
  };
  //hook de eliminación
  const deleteBranch = useDeleteBranch();
  //funcion de eliminación
  const handleDeleteBranch = async (idBranch: string) => {
    const promise = deleteBranch.mutateAsync(idBranch);
    try {
      await toast.promise(promise, {
        loading: "Eliminando sucursal...",
        success: "Sucursal eliminada con éxito.",
        error: (err) => `${err.message || "Error desconocido"}`,
        position: "top-right",
        duration: 4000,
      });
      //poner estado global de la sucrusal en nulo
      if (currentBranch === idBranch) {
        setBranchId(null);
      }
    } catch (error) {
      console.error("Error capturado después de la mutación:", error);
    }
  };

  return (
    <div className="p-4 bg-background h-full overflow-y-auto">
      <div
        className="max-w-7xl mx-auto space-y-3
      lg:space-y-5"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* titulo mas descripcion */}
          <div className="space-y-2">
            <h1
              className="tracking-wide font-title text-xl text-foreground
            lg:text-2xl"
            >
              Lista de Sucursales
            </h1>
            <p
              className="text-sm text-muted-foreground
            lg:text-base"
            >
              Gestiona y administra las sucursales de tu empresa desde este
              panel.
            </p>
          </div>

          <Button
            onClick={() => {
              setBranchS(undefined);
              handleOpenModal();
            }}
            className="btn-create"
          >
            <Plus size={18} />
            <span>Nueva Sucursal</span>
          </Button>
        </div>

        {/* Grid */}
        {branches && branches.length > 0 && (
          <Branches
            branches={branches}
            setBranchS={setBranchS}
            handleOpenModal={handleOpenModal}
            handleOpenAlertDelete={handleOpenAlertDelete}
          />
        )}

        {branches && branches.length === 0 && <EmptyBranches />}
      </div>

      {/* Modal con el formulario para agregar o editar una sucursal */}
      <ModalAddBranch
        isOpen={isModalOpen}
        setOpen={handleOpenModal}
        onSubmit={onSubmit}
        initialValues={branchS} // Pasamos los valores iniciales para editar
      />

      {/* Alert de eliminación */}
      <AlertDelete
        title="Eliminar"
        description="¿Estás seguro de que deseas eliminar esta sucursal? Esta acción no se puede deshacer."
        isOpen={isOpenDelete}
        setOpenAlert={handleOpenAlertDelete}
        funDelete={() => {
          if (branchS) {
            handleDeleteBranch(branchS.id);
          }
        }}
        nameDelete={branchS?.branch_name}
      />

      {isLoading && <SkeletonBranches />}

      {isError && <Error />}
    </div>
  );
};

export default Branch;
