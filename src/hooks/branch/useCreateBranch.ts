import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBranch } from "@/services/branchService";
//importar lo types del branch
import type { BranchInput, BranchOutput } from "@/types/branch";

export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation<BranchOutput, Error, BranchInput>({
    // La función 'mutationFn' que llama a tu API de Supabase
    mutationFn: (branchData) => createBranch(branchData),

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
