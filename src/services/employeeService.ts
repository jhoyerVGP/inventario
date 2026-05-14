import { supabase } from "@/api/supabaseClient";
//parametors que enviaremos al backend
//type del empleado
import { type FormEmployeeInput } from "@/types/employee";
import type { queryParams } from "@/types/table";

// Get employees desde supabase - OPTIMIZADO
export const getEmployees = async (
  params: queryParams,
  //branchId: string | null,
  typeEmployee: "todos" | "con_acceso" | "sin_acceso",
  employeeId: string,
) => {
  const { page, limit, search, sortField, sortOrder, branchId } = params;
  // Calculamos la paginación
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  // UNA SOLA QUERY con count incluido
  let query = supabase
    .from("employees")
    .select(
      `id,name,cedula,address,phone,birthDate,job,branchId,users(id,email,role)`,
      {
        count: "exact",
      },
    )
    .neq("id", employeeId);

  // Búsqueda global
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,cedula.ilike.%${search}%,address.ilike.%${search}%,phone.ilike.%${search}%`,
    );
  }

  // Filtro por acceso al sistema
  if (typeEmployee === "con_acceso") {
    // Solo trae empleados donde la relación 'users' NO sea nula
    query = query.not("users", "is", null);
  } else if (typeEmployee === "sin_acceso") {
    // Solo trae empleados donde la relación 'users' SEA nula
    query = query.is("users", null);
  }

  //ahora verificar si traer solo los empleados de una sucursal o de todas
  if (branchId !== null) {
    query = query.eq("branchId", branchId);
  }

  // Aplicamos ordenamiento
  if (sortField) {
    query = query.order(sortField, {
      ascending: sortOrder === "asc",
    });
  }

  // Aplicamos el range DIRECTAMENTE (Supabase maneja automáticamente si hay menos datos)
  query = query.range(from, to);

  // Ejecutamos la query
  const { data, error, count } = await query;

  if (error) {
    throw new Error("Error al obtener empleados");
  }
  //refinar datos
  const dataReifined = data.map((emp: any) =>
    //console.log("birthDate raw:", emp.birthDate, typeof emp.birthDate),
    ({
      id: emp.id,
      name: emp.name,
      cedula: emp.cedula,
      address: emp.address,
      phone: emp.phone,
      // Convertimos el string de la fecha a un objeto Date real
      birthDate: emp.birthDate,
      job: emp.job,
      branchId: emp.branchId,
      // Aplanamos los datos del usuario si existen
      email: emp.users?.email || null,
      systemRole: emp.users?.role || null,
      idUser: emp.users?.id || null,
    }),
  );
  //console.log("Data refined:", dataReifined);
  return {
    data: dataReifined || [],
    meta: {
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    },
  };
};

// Crear un nuevo empleado
export const createEmployee = async (payload: FormEmployeeInput) => {
  if (payload.hasSystemAccess) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) throw new Error("No session");

    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-employee`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          p_name: payload.name,
          p_job: payload.job,
          p_branch_id: payload.branchId,
          p_has_system: payload.hasSystemAccess,

          p_cedula: payload.cedula,
          p_address: payload.address,
          p_phone: payload.phone,
          p_birth_date: payload.birthDate,

          p_email: payload.email,
          p_password: payload.password,
          p_system_role: payload.systemRole,
          p_force_password_change: true,
        }),
      },
    );

    const json = await res.json();

    if (!res.ok) throw new Error(json.error);

    return json;
  } else {
    const { data, error } = await supabase.rpc("create_employee_and_user", {
      p_name: payload.name,
      p_job: payload.job,
      p_branch_id: payload.branchId,
      p_has_system: payload.hasSystemAccess,
      p_cedula: payload.cedula,
      p_address: payload.address,
      p_phone: payload.phone,
      p_birth_date: payload.birthDate,
    });

    if (error) {
      throw new Error("Error al crear empleado sin acceso");
    }

    return data;
  }
};

// Actualizar un empleado
export const updateEmployee = async (
  employeeId: string,
  dataEmp: FormEmployeeInput,
) => {
  const { data, error } = await supabase.rpc("update_employee_and_user", {
    p_employee_id: employeeId,
    p_name: dataEmp.name,
    p_job: dataEmp.job,
    p_branch_id: dataEmp.branchId,
    p_cedula: dataEmp.cedula,
    p_address: dataEmp.address,
    p_phone: dataEmp.phone,
    p_birth_date: dataEmp.birthDate,
    p_system_role: dataEmp.systemRole,
  });

  if (error) {
    //console.error("Error al actualizar empleado:", error);
    throw new Error("Error al actualizar empleado");
  }

  return data;
};

//eliminar un empleado
export const deleteEmployee = async (
  idEmp: string,
  hasSystemAccess: boolean,
) => {
  if (!hasSystemAccess) {
    const { data, error } = await supabase.rpc("delete_employee_decision", {
      p_employee_id: idEmp,
    });

    if (error) {
      throw new Error("Error al eliminar empleado");
    }

    return data;
  }

  // EMPLEADO CON ACCESO → EDGE FUNCTION
  const { data, error } = await supabase.functions.invoke(
    "delete-employee", // nombre EXACTO de tu edge
    {
      body: {
        employee_id: idEmp,
      },
    },
  );

  if (error) {
    throw new Error(error.message || "Error al eliminar empleado");
  }

  return data;
};
