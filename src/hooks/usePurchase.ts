import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPurchase,
  getPurchases,
  getPurchaseById,
  updatePurchase,
  cancelPurchase,
  getPurchasesByDateRange,
  getLowStockProductsByBranch,
} from "@/services/purchaseService";
import type { PurchaseDetailInput } from "@/types/purchase";
import type { TableParams } from "@/components/common/tabla/api";
import { useAuth } from "@/context/AuthContext";

export const useGetPurchases = (
  params: TableParams,
  branchId?: string,
  supplierId?: string
) => {
  return useQuery({
    queryKey: ["purchases", params, branchId, supplierId],
    queryFn: () => getPurchases(params, branchId, supplierId),
  });
};

export const useGetPurchaseById = (id: string) => {
  return useQuery({
    queryKey: ["purchase", id],
    queryFn: () => getPurchaseById(id),
    enabled: !!id,
  });
};

export const useCreatePurchase = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({
      supplierId,
      branchId,
      details,
      notes,
    }: {
      supplierId: string;
      branchId: string;
      details: PurchaseDetailInput[];
      notes?: string;
    }) => {
      if (!user?.id) throw new Error("Usuario no autenticado");
      return createPurchase(supplierId, branchId, user.id, details, notes);
    },
    onSuccess: () => {
      toast.success("Compra registrada correctamente");
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al crear compra");
    },
  });
};

export const useUpdatePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: {
        status?: "PENDING" | "RECEIVED" | "CANCELLED";
        notes?: string;
      };
    }) => updatePurchase(id, updates),
    onSuccess: () => {
      toast.success("Compra actualizada correctamente");
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar compra");
    },
  });
};

export const useCancelPurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelPurchase(id),
    onSuccess: () => {
      toast.success("Compra cancelada y stock revertido");
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al cancelar compra");
    },
  });
};

export const useGetPurchasesByDateRange = (
  branchId: string,
  startDate: Date,
  endDate: Date,
  supplierId?: string
) => {
  return useQuery({
    queryKey: ["purchasesByDate", branchId, startDate, endDate, supplierId],
    queryFn: () =>
      getPurchasesByDateRange(branchId, startDate, endDate, supplierId),
    enabled: !!branchId,
  });
};

export const useGetLowStockProducts = (branchId: string) => {
  return useQuery({
    queryKey: ["lowStockProducts", branchId],
    queryFn: () => getLowStockProductsByBranch(branchId),
    enabled: !!branchId,
  });
};
