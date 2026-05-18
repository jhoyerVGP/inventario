import { DataTable } from "../../components/common/tabla/DataTable";
import { DebouncedInput } from "../../components/common/tabla/DebouncedInput";
import { Button } from "@/components/ui/button";
import { columnsPersonal } from "./columnsEmployee";
import { useServerTableState } from "../../components/common/tabla/useServerTableState";
//hooks para obtener,crear,actualizar y eliminar los empleados
import useGetEmployee from "../../hooks/employee/useGetEmployee";
import { useUpdateEmployee } from "@/hooks/employee/useUpdateEmployee";
import { useDeleteEmployee } from "@/hooks/employee/useDeleteEmployee";
import { useCreateEmployee } from "@/hooks/employee/useCreateEmployee";
//hook para resertar credenciales
import { useUpdateCredential } from "@/hooks/credential/useUpdateCredential";
//context de la sucursal
import { useBranch } from "../../context/BranchContext";
//modales
import { ModalEmployee } from "@/components/Eployee/ModalEmployee";
import { AlertDelete } from "@/components/common/AlertDelet";
import { ModalCredencials } from "@/components/Eployee/ModalCredencials";
//tipo para el formulario de empleado
import { type Employee, type FormEmployeeInput } from "@/types/employee";
//context del user
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ResetCredentialsForm } from "@/schemes/credecials";
import { Plus } from "lucide-react";
import { FilterEmployee } from "@/components/Eployee/FilterEmployee";
import useFilterEmployee from "@/hooks/employee/useFilterEmployee";

export default function Employee() {
  //logica de la tabla
  const tableState = useServerTableState({});

  //usamos el contexto de sucursal
  const { currentBranch } = useBranch();
  useEffect(() => {
    tableState.setPagination({
      pageIndex: 0,
      pageSize: tableState.pagination.pageSize,
    });
  }, [currentBranch]);

  //filtrado de empleados
  const { typeEmployee, changeTypeEmployee } = useFilterEmployee();
  const { data, isLoading, isError } = useGetEmployee(
    { ...tableState.apiParams, branchId: currentBranch || null },
    typeEmployee,
  );

  //estado para contorlar el form de solo lectura
  const [disableMod, setDesableMod] = useState(false);
  //logica para crear y actualizar el empleado
  const create = useCreateEmployee();
  const update = useUpdateEmployee();
  //logica para el empleado seleccionado
  const [empSelected, setEmpSelected] = useState<Employee | undefined>(
    undefined,
  );

  //logica del modal
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  //funcion para el submit del formulario
  const handleSubmit = (dataEmp: FormEmployeeInput) => {
    const promise = empSelected
      ? update.mutateAsync({ id: empSelected.id, dataEmployee: dataEmp })
      : create.mutateAsync(dataEmp);

    toast.promise(promise, {
      loading: empSelected ? "Actualizando empleado..." : "Creando empleado...",
      success: empSelected
        ? "Empleado actualizado con éxito"
        : "Empleado creado con éxito",
      error: empSelected
        ? "Error al actualizar el empleado"
        : "Error al crear el empleado",
      position: "top-right",
      duration: 3500,
    });

    handleOpen();
  };

  //funcion para abrir el modal desde el boton de editar
  const openEditModal = (empSelected: Employee) => {
    setDesableMod(false);
    setEmpSelected(empSelected);
    handleOpen();
  };

  //funcion para abrir el modal desde el boton de ver
  const openViewModal = (empSelected: Employee, disable: boolean) => {
    setEmpSelected(empSelected);
    setDesableMod(disable);
    handleOpen();
  };

  //logica para el modal de eliminacion
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const handleOpenDelete = () => {
    setIsOpenDelete(!isOpenDelete);
  };
  const openDeleteAlert = (empSelected: Employee) => {
    setEmpSelected(empSelected);
    handleOpenDelete();
  };

  //Logica de eliminacion del empleado
  const deleteE = useDeleteEmployee();
  //funcion para eliminar empleado
  const handleDeleteEmployee = () => {
    const promise = deleteE.mutateAsync({
      idEmp: empSelected?.id || "",
      hasSystemAccess: empSelected?.email ? true : false,
    });
    toast.promise(promise, {
      loading: "Eliminando empleado...",
      success: "Empleado eliminado con éxito",
      error: "Error al eliminar el empleado",
      position: "top-right",
      duration: 3500,
    });
  };

  //logica para el modal de resetear credenciales
  const [openCM, setOpenCM] = useState(false);
  const openCModal = (empSelected: Employee) => {
    setEmpSelected(empSelected);
    setOpenCM(true);
  };
  const resetC = useUpdateCredential();
  const handleResetCredentials = (dataForm: ResetCredentialsForm) => {
    const promise = resetC.mutateAsync({
      email: dataForm.email,
      employeeId: empSelected?.id || "",
      resetPassword: dataForm.resetPassword,
      password: dataForm.password,
    });
    toast.promise(promise, {
      loading: "Actualizando credenciales...",
      success: "Credenciales actualizadas con éxito",
      error: "Error al actualizar las credenciales",
      position: "top-right",
      duration: 3500,
    });
    setOpenCM(false);
  };

  //role del usuario
  const { user } = useAuth();
  const role = user?.role || "SINROLE";
  return (
    <div className="bg-background h-full">
      <div className="h-[calc(100vh-64px)] flex flex-col max-w-7xl mx-auto py-2 gap-2 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between shrink-0">
          <h1
            className="tracking-wide font-title text-xl text-foreground
            lg:text-2xl"
          >
            Lista de Empleados
          </h1>
          {role === "SUPERADMIN" && (
            <Button
              onClick={() => {
                setEmpSelected(undefined);
                setDesableMod(false);
                handleOpen();
              }}
              className="btn-create w-full"
            >
              <Plus size={18} />
              Agregar Empleado
            </Button>
          )}
        </div>
        <div className="flex gap-4">
          <DebouncedInput
            valueDafault={tableState.globalFilter ?? ""}
            onChange={tableState.onGlobalFilterChange}
            placeholder="Buscar empleados..."
          />
          <FilterEmployee
            setTypeEmployee={changeTypeEmployee}
            typeEmployee={typeEmployee}
          />
        </div>
        {/* TABLA - Crece para ocupar espacio restante */}
        <div className="flex-1 min-h-0">
          <DataTable
            columns={columnsPersonal({
              setOpenEdit: openEditModal,
              setOpenView: openViewModal,
              setOpenDelete: openDeleteAlert,
              setOpenCM: openCModal,
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

        {/* Renderizar Modal de acciones */}
        <ModalEmployee
          isOpen={isOpen}
          setOpen={handleOpen}
          onSubmit={handleSubmit}
          initialValues={empSelected}
          branchIdC={currentBranch || undefined}
          isViewMode={disableMod}
        />

        {/* modal de eliminacion */}
        <AlertDelete
          title="Eliminar empleado"
          description="El empleado se eliminará permanentemente. ¿Estás seguro de que deseas continuar?"
          isOpen={isOpenDelete}
          setOpenAlert={handleOpenDelete}
          funDelete={handleDeleteEmployee}
        />

        {/* Modal Para Las Credenciales */}
        <ModalCredencials
          funParent={handleResetCredentials}
          isOpen={openCM}
          setOpen={() => setOpenCM(!openCM)}
          emailC={empSelected?.email}
        />
      </div>
    </div>
  );
}
