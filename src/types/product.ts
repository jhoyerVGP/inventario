//lo que devuelve el servidor
export interface Product {
  id: string;
  deleted_at?: Date;
  brand?: string;
  categoryId: string;
  cost: number;
  created_at: string;
  description?: string;
  endDate?: string;
  isOfferActive: boolean;
  nameProd: string;
  price: number;
  proceOffer?: number;
  sku?: string;
  slug?: string;
  updated_at: string;
  startDate?: string;
  //campos nuevos para limpieza
  unit?: string; // Unidad de medida
  barcode?: string; // Código de barras
  minstock?: number; // Stock mínimo
  supplierid?: string; // ID proveedor
  //campos agregados no propios del producto en su tabla
  main_image?: string;
  category_name?: string;
  supplier_name?: string; // Nombre del proveedor
  total_stock?: number; //stock total en todas las sucursales
  branchId?: string; //id de la sucursal si es que se obtiene por sucursal
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  position: number;
  created_at?: string;
  updated_at?: string;
}

//super type para el formulario
export interface ProductType {
  sku?: string;
  nameProd: string;
  slug?: string;
  price: number;
  cost: number;
  description: string;
  brand?: string;
  categoryId: string;
  unit?: string; // Unidad de medida
  barcode?: string; // Código de barras
  minstock?: number; // Stock mínimo
  supplierid?: string; // ID proveedor

  // superset de ambos schemas
  images?: FileList | null;
  imageExisting?: string[];
  imageToDelete?: string[];
}

// Este es el tipo que usaremos para pasar los datos YA LIMPIOS al servicio.
export type ProductSupT = Omit<ProductType, "images"> & {
  images: File[]; // <--- Sobreescribimos FileList a File[]
};
