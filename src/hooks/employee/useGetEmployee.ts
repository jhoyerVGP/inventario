import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/services/employeeService";
//type employee
import { type Employee } from "@/types/employee";
import type { queryParams } from "@/types/table";
import type { PaginatedResponse } from "@/components/common/tabla/api";
import { useEffect, useRef } from "react";
import { useCheckAuth } from "../auth/useCheckAuth";

const useGetEmployee = (
  params: queryParams,
  typeEmployee: "todos" | "con_acceso" | "sin_acceso",
) => {
  const prevBranch = useRef(params.branchId);
  const isSwitching = prevBranch.current !== params.branchId;

  const { data } = useCheckAuth();
  const employeeId = data?.employeeId || "";

  useEffect(() => {
    prevBranch.current = params.branchId;
  }, [params.branchId]);

  return useQuery<PaginatedResponse<Employee>, Error>({
    queryKey: ["employees", params, typeEmployee],
    queryFn: () => getEmployees(params, typeEmployee, employeeId),
    enabled: !isSwitching,
    retry: false,
  });
};

export default useGetEmployee;
