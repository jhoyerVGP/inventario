import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBranch } from "@/services/branchService";
//importar lo types del branch
import type { BranchInput, BranchOutput } from "@/types/branch";
import { useCheckAuth } from "../auth/useCheckAuth";

export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  const { data } = useCheckAuth();
  const organizacionId = data?.organization?.id || "";

  return useMutation<BranchOutput, Error, BranchInput>({
    // La función 'mutationFn' que llama a tu API de Supabase
    mutationFn: (branchData) => createBranch(branchData, organizacionId),

    // Opcional: Lógica después de que la mutación es exitosa
    onSuccess: () => {
      // 1. Invalidar la caché
      // Esto fuerza a TanStack Query a volver a solicitar la lista de sucursales
      // para que el dashboard muestre la nueva sucursal inmediatamente.
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },

    // Opcional: Manejo de errores
    onError: (error) => {
      console.error("Error al crear sucursal:", error.message);
    },
  });
};
