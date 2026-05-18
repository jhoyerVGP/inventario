import { Button } from "@/components/ui/button";
//importamos el modal de creacion
import { ModalCategory } from "@/components/category/ModalCategory";
import { useState } from "react";
//importamos el hook para crear
import { useCreateCategory } from "@/hooks/category/useCreateCategory";
//import del hook para el get con tabla dinamica
import useGetCategoryT from "@/hooks/category/useGetCategoryT";
//import hook de update
import { useUpdateCategory } from "@/hooks/category/useUpdateCategory";
//importamos los types
import type { categoryInput, CategoryType } from "@/types/category";
import { toast } from "sonner";
import { columnsCategory } from "./ColumnsCategory";
//tabla dinamica
import { DataTable } from "@/components/common/tabla/DataTable";
import { useServerTableState } from "@/components/common/tabla/useServerTableState";
import { AlertDelete } from "@/components/common/AlertDelet";
import { useDeleteCategory } from "@/hooks/category/useDeleteCategory";
import { DebouncedInput } from "@/components/common/tabla/DebouncedInput";
import { Plus } from "lucide-react";

const Category = () => {
  //logica del hook de creacion
  const create = useCreateCategory();
  const update = useUpdateCategory();

  const [open, setOpen] = useState<boolean>(false);

  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [categoryUV, setCategoryUV] = useState<CategoryType | null>(null);

  const handleOpenUpdate = (category: CategoryType) => {
    setCategoryUV(category);
    setOpen(!open);
  };

  const handleOpenDelete = (category: CategoryType) => {
    setCategoryUV(category);
    setOpenDelete(!openDelete);
  };

  const handleSubmit = (data: categoryInput) => {
    const promise = categoryUV
      ? update.mutateAsync({ id: categoryUV.id, dataCat: data })
      : create.mutateAsync(data);
    toast.promise(promise, {
      success: categoryUV
        ? "Categoria actualizada con exito"
        : "Categoria creada con exito",
      loading: categoryUV
        ? "Actualizando categoria..."
        : "Creando categoria...",
      error: categoryUV
        ? "Error al actualizar la categoria"
        : "Error al crear la categoria",
      position: "top-right",
      duration: 3500,
    });
    setCategoryUV(null);
    setOpen(false);
  };

  //logica de eliminacion
  const deleteCat = useDeleteCategory();
  const handleDelete = () => {
    if (!categoryUV) return;
    const promise = deleteCat.mutateAsync(categoryUV!.id);
    toast.promise(promise, {
      success: "Categoria eliminada con exito",
      loading: "Verificando y eliminando categoria...",
      error: (err) => {
        return err.message || "Error al eliminar la categoría";
      },
      position: "top-right",
      duration: 4000,
    });
    setCategoryUV(null);
    setOpenDelete(false);
  };

  //hook que trae los datos
  const tableState = useServerTableState({});
  const { data, isLoading, isError } = useGetCategoryT(tableState, null);

  //modo vista o update
  const [mode, setMode] = useState<"view" | "update" | "create">("create");

  return (
    <div className="bg-background h-full w-full">
      <div className="h-[calc(100vh-54px)] flex flex-col max-w-7xl mx-auto py-2 gap-2 px-4">
        <div
          className="flex flex-col gap-3 justify-between md:items-center shrink-0
      md:flex-row relative"
        >
          <h1 className="text-2xl font-semibold">Lista de categorías</h1>
          <div className="flex items-center gap-6">
            <Button
              className="btn-create w-full"
              onClick={() => {
                setCategoryUV(null);
                setOpen(true);
              }}
            >
              <Plus size={18} />
              Agregar categoria
            </Button>
          </div>
        </div>
        {/* el buscador */}
        <DebouncedInput
          valueDafault={tableState.globalFilter ?? ""}
          onChange={tableState.onGlobalFilterChange}
          placeholder="Buscar empleados..."
        />
        {/* TABLA - Crece para ocupar espacio restante */}
        <div className="flex-1 min-h-0 w-full">
          <DataTable
            columns={columnsCategory({
              setOpenEdit: handleOpenUpdate,
              setOpenView: handleOpenUpdate,
              setOpenDelete: handleOpenDelete,
              setMode: setMode,
            })}
            data={data?.data || []}
            rowCount={data?.meta.total ?? 0}
            pagination={tableState.pagination}
            setPagination={tableState.setPagination}
            sorting={tableState.sorting}
            setSorting={tableState.setSorting}
            isLoading={isLoading}
            isError={isError}
          />
        </div>

        {/* modal de categori */}
        <ModalCategory
          isOpen={open}
          setIsOpen={() => setOpen(!open)}
          funSubParent={handleSubmit}
          initialData={categoryUV || undefined}
          mode={mode}
        />

        {/* alert de eliminacion */}
        <AlertDelete
          title="Eliminar Categoria"
          description="¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer."
          isOpen={openDelete}
          setOpenAlert={() => setOpenDelete(!openDelete)}
          funDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Category;
