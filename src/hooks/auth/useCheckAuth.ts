import { useQuery } from "@tanstack/react-query";
import {
  checkAuth,
  userAuthData,
  userEmployee,
} from "../../services/authService";

//hook para revisar si hay inicio de sesión
export const useCheckAuth = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const authUser = await checkAuth();
      if (!authUser) return null;
      //console.log("authUser en useCheckAuth:", authUser);

      //si hay sesion vamos a traer los datos del usuario
      const userData = await userAuthData(authUser.id);
      //console.log("userData en useCheckAuth:", userData);

      if (!userData) return null;
      //traer el nombre del empleado
      const employeeData = await userEmployee(userData.employeeId);
      //console.log("employeeData en useCheckAuth:", employeeData);

      if (!employeeData) return null;

      /* const user = {
        id: userData.id,
        name: employeeData.name,
        email: userData.email,
        role: userData.role,
        branchId: employeeData.branchId,
        avatar: userData.avatar,
        phone: employeeData.phone,
      }; */

      const user = {
        id: userData.id,
        employeeId: employeeData.id,
        name: employeeData.name,
        email: userData.email,
        role: userData.role,
        branchId: employeeData.branchId,
        avatar: userData.avatar,
        phone: employeeData.phone,
      };

      return user;
    },
  });
};
