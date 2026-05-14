import { supabase } from "@/api/supabaseClient";
import type { loginCredentials } from "@/schemes/auth";
import type { PasswordChange } from "@/types/auth";

//funcion para el cambio de contraseña
export const changePassword = async ({
  email,
  currentPassword,
  newPassword,
}: PasswordChange) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });

  if (error) throw new Error("La contraseña actual es incorrecta.");

  //Si el login funcionó, actualizamos a la nueva contraseña
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    throw updateError;
  }

  return data.user;
};

//función para iniciar sesión con supabase
export const login = async ({ email, password }: loginCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data.user;
};

//función para cerrar sesión con supabase
export const logout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
};

//verifica si el usuario está autenticado con supabase
export const checkAuth = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) throw error;

  return data.session?.user; // si no hay sesión, devuelve null
};

//-----------  para el context datos del usuario  -----------------
export const userAuthData = async (authUserId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select(
      `
    id,
    email,
    role,
    forcePasswordChange,
    employeeId,
    avatar
  `,
    )
    .eq("auth_user_id", authUserId)
    .single();

  if (error) throw new Error(error.message);

  return data;
};

/* export const userEmployee = async (employeeId: string) => {
  const { data, error } = await supabase
    .from("employees")
    .select("id,name,phone,branchId")
    .eq("id", employeeId)
    .single();

  if (error) throw error;

  return data;} */

// en authService.ts
export const userEmployee = async (employeeId: string) => {
  const { data, error } = await supabase
    .from("employees")
    .select("id, name, phone, branchId")
    .eq("id", employeeId)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    name: data.name,
    phone: data.phone,
    branchId: data.branchId,
  };
};
//--------------------------------------------------------------
