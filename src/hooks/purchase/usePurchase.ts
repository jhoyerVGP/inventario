import { useQuery } from "@tanstack/react-query";
import { getPurchases } from "@/services/purchaseService";
import type { ServerTableParams } from "@/components/common/tabla/useServerTableState";

import { getPurchaseById } from "@/services/purchaseService";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPurchase,
  updatePurchase,
  deletePurchase,
  confirmPurchase,
} from "@/services/purchaseService";
import type { PurchaseFormValues } from "@/schemes/purchase";

// Hooks auxiliares para los selects del formulario
import {
  getSuppliers,
  getProductsForPurchase,
} from "@/services/purchaseService";

export const useGetPurchases = (params: ServerTableParams) =>
  useQuery({
    queryKey: ["purchases", params],
    queryFn: () => getPurchases(params),
    placeholderData: (prev) => prev,
  });

export const useGetPurchaseById = (id: string | null) =>
  useQuery({
    queryKey: ["purchase", id],
    queryFn: () => getPurchaseById(id!),
    enabled: !!id,
  });

export const useCreatePurchase = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      formValues,
      userId,
    }: {
      formValues: PurchaseFormValues;
      userId: string;
    }) => createPurchase(formValues, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchases"] });
      // Invalida stock también, por si hay vistas abiertas
      qc.invalidateQueries({ queryKey: ["branchStocks"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdatePurchase = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      formValues,
    }: {
      id: string;
      formValues: PurchaseFormValues;
    }) => updatePurchase(id, formValues),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchases"] });
      qc.invalidateQueries({ queryKey: ["purchase"] });
      qc.invalidateQueries({ queryKey: ["branchStocks"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeletePurchase = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePurchase(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchases"] });
      qc.invalidateQueries({ queryKey: ["branchStocks"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useConfirmPurchase = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => confirmPurchase(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchases"] });
      qc.invalidateQueries({ queryKey: ["purchase"] });
      qc.invalidateQueries({ queryKey: ["branchStocks"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useGetSuppliers = () =>
  useQuery({
    queryKey: ["suppliers"],
    queryFn: getSuppliers,
    staleTime: 1000 * 60 * 5,
  });

export const useGetProductsForPurchase = (branchId: string | null) =>
  useQuery({
    queryKey: ["productsForPurchase", branchId],
    queryFn: () => getProductsForPurchase(branchId!),
    enabled: !!branchId,
    staleTime: 1000 * 30,
  });
