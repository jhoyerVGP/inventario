//imports de la tabla
import { useServerTableState } from "@/components/common/tabla/useServerTableState";
import { DataTable } from "@/components/common/tabla/DataTable";
import { columnsMovement } from "./ColumnsMovement";
//importamos el hook para obtener los movimientos
import { useGetMovements } from "@/hooks/movement/useGetMovements";
import { DebouncedInput } from "@/components/common/tabla/DebouncedInput";
import { useEffect, useState } from "react";
import type { Movement } from "@/types/movement";
import { ModalDetMovement } from "@/components/movement/ModalDetMovement";
import { useBranch } from "@/context/BranchContext";

const Movements = () => {
  //usamos el hook del a tabla
  const tableState = useServerTableState({});

  //usamos el contexto de sucursal
  const { currentBranch } = useBranch();
  useEffect(() => {
    tableState.setPagination({
      pageIndex: 0,
      pageSize: tableState.pagination.pageSize,
    });
  }, [currentBranch]);

  //usamos el hook para obtener los movimientos
  const { data, isLoading, isError } = useGetMovements(
    tableState.apiParams,
    currentBranch,
  );

  //logica para mostrar los detalles en un modal
  //estado para el modal de detalles
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(
    null,
  );
  const openModal = (movement: Movement) => {
    setSelectedMovement(movement);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovement(null);
  };

  return (
    <div className="bg-background h-full">
      <div className="h-[calc(100vh-54px)] flex flex-col max-w-7xl mx-auto py-2 gap-2 px-4 itmes-between">
        <div className="flex flex-col md:flex-row md:items-center justify-between shrink-0">
          <h1
            className="tracking-wide font-title text-xl text-foreground
            lg:text-2xl"
          >
            Lista de Movimientos
          </h1>
          {/* buscador */}
          <DebouncedInput
            valueDafault={tableState.globalFilter ?? ""}
            onChange={tableState.onGlobalFilterChange}
            placeholder="Buscar movimientos..."
          />
        </div>
        {/* tabla */}
        <div className="flex-1 min-h-0">
          <DataTable
            columns={columnsMovement({ openModal })}
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

        {/* modal de detalles */}
        <ModalDetMovement
          isOpen={isModalOpen}
          onClose={closeModal}
          movement={selectedMovement!}
        />
      </div>
    </div>
  );
};

export default Movements;
