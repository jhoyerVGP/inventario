import { type ColumnDef } from "@tanstack/react-table";
import { type Employee } from "@/types/employee";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye /* Calendar */,
  Key,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
//contest del user
import { useAuth } from "@/context/AuthContext";

interface ColumnProps {
  setOpenEdit: (empleado: Employee) => void;
  setOpenView: (empleado: Employee, disable: boolean) => void;
  setOpenDelete: (empleado: Employee) => void;
  setOpenCM: (empleado: Employee) => void;
}

export const columnsPersonal = ({
  setOpenEdit,
  setOpenView,
  setOpenDelete,
  setOpenCM,
}: ColumnProps): ColumnDef<Employee>[] => [
  {
    accessorKey: "name",
    header: "Nombre Completo",
    enableSorting: true,
    cell: ({ row }) => {
      const name = row.original.name || "Sin nombre";
      return (
        <div className="flex items-center gap-3">
          <span className="text-card-foreground">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "cedula",
    header: "Cédula",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-card-foreground">
        {row.original.cedula || "Sin cédula"}
      </span>
    ),
  },
  {
    accessorKey: "job_position",
    header: "Cargo",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        {row.original.job || "Sin cargo"}
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-card-foreground">
        {row.original.phone || "Sin teléfono"}
      </span>
    ),
  },
  {
    accessorKey: "Edad",
    header: "Edad",
    enableSorting: true,
    cell: ({ row }) => {
      if (!row.original.birthDate) return "Sin edad";
      const hoy = new Date();
      const nacimiento = new Date(row.original.birthDate + "T00:00:00");

      let edad = hoy.getFullYear() - nacimiento.getFullYear();

      // Ajustar si todavía no cumplió años este año
      const cumplea = new Date(
        hoy.getFullYear(),
        nacimiento.getMonth(),
        nacimiento.getDate(),
      );
      if (hoy < cumplea) edad--;

      return edad;
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const employee = row.original;
      const { user } = useAuth();
      const role = user?.role || "SINROLE";
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                let employeeEnviar = {
                  ...employee,
                  birthDate: employee.birthDate
                    ? new Date(employee.birthDate + "T00:00")
                    : undefined,
                };
                setOpenView(employeeEnviar, true);
              }}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              <span>Ver detalles</span>
            </DropdownMenuItem>

            {/* solo SUPERADMIN PUEDE HACE ESTO */}
            {role === "SUPERADMIN" && (
              <DropdownMenuItem
                onClick={() => {
                  const employEnviar = {
                    ...employee,
                    birthDate: employee.birthDate
                      ? new Date(employee.birthDate + "T00:00")
                      : undefined,
                  };
                  setOpenEdit(employEnviar);
                }}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                <span>Editar</span>
              </DropdownMenuItem>
            )}

            {role === "SUPERADMIN" && employee.email && (
              <DropdownMenuItem
                onClick={() => {
                  setOpenCM(employee);
                }}
                className="cursor-pointer"
              >
                <Key className="mr-2 h-4 w-4" />
                <span>Resetear Credenciales</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                setOpenDelete(employee);
              }}
              className="cursor-pointer text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Eliminar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
