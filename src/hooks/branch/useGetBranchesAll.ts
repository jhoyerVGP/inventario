import { useQuery } from "@tanstack/react-query";
import { getBranches } from "@/services/branchService"; // ajusta el path
import type { BranchOutput } from "@/types/branch"; // ajusta el path

export const useBranches = () => {
  return useQuery<BranchOutput[]>({
    queryKey: ["branches"],
    queryFn: getBranches,
    staleTime: 1000 * 60 * 5, // 5 min, las sucursales no cambian seguido
  });
};
