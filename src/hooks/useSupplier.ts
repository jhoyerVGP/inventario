import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  toggleSupplierStatus,
  getSuppliersAll,
} from "@/services/supplierService";
import type { SupplierType } from "@/types/supplier";
import type { TableParams } from "@/components/common/tabla/api";

export const useGetSuppliersAll = () => {
  return useQuery({
    queryKey: ["suppliers-all"],
    queryFn: () => getSuppliersAll(),
  });
};

export const useGetSuppliers = (params: TableParams) => {
  return useQuery({
    queryKey: ["suppliers", params],
    queryFn: () => getSuppliers(params),
  });
};

export const useGetSupplierById = (id: string) => {
  return useQuery({
    queryKey: ["supplier", id],
    queryFn: () => getSupplierById(id),
    enabled: !!id,
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SupplierType) => createSupplier(data),
    onSuccess: () => {
      toast.success("Proveedor creado correctamente", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers-all"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear proveedor");
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SupplierType }) =>
      updateSupplier(id, data),
    onSuccess: () => {
      toast.success("Proveedor actualizado correctamente", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers-all"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar proveedor");
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSupplier(id),
    onSuccess: () => {
      toast.success("Proveedor eliminado correctamente", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers-all"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al eliminar proveedor", {
        position: "top-right",
      });
    },
  });
};

export const useToggleSupplierStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      toggleSupplierStatus(id, active),
    onSuccess: (_, { active }) => {
      toast.success(active ? "Proveedor activado" : "Proveedor desactivado", {
        position: "top-right",
      });
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers-all"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al cambiar estado", {
        position: "top-right",
      });
    },
  });
};
