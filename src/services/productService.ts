import { supabase } from "@/api/supabaseClient";
//parametors que enviaremos al backend
import type { TableParams } from "@/components/common/tabla/api";
import type { ProductInputService } from "@/schemes/product";
import type { ProductSupT } from "@/types/product";
import type { OfferFormValues } from "@/schemes/product";
import { processProductImage } from "@/utils/processProductImage";

//create product
export const createProduct = async (dataProducto: ProductInputService) => {
  const { data, error } = await supabase
    .from("products")
    .insert({
      sku: dataProducto.sku,
      nameProd: dataProducto.nameProd,
      price: dataProducto.price,
      cost: dataProducto.cost,
      description: dataProducto.description,
      brand: dataProducto.brand,
      categoryId: dataProducto.categoryId,
      unit: dataProducto.unit,
      barcode: dataProducto.barcode,
      minstock: dataProducto.minstock || 0,
      supplierid: dataProducto.supplierid,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  for (let i = 0; i < dataProducto.images.length; i++) {
    const file = dataProducto.images[i];
    const processedFile = await processProductImage(file);

    // Subir archivo
    const upload = await supabase.storage
      .from("img-products")
      .upload(`product-${data.id}/${processedFile.name}`, processedFile);

    // Obtener URL pública
    const { data: url } = supabase.storage
      .from("img-products")
      .getPublicUrl(`product-${data.id}/${processedFile.name}`);

    // Guardar URL en la base de datos
    const insert = await supabase.from("product_images").insert({
      product_id: data.id,
      image_url: url.publicUrl,
      position: i + 1,
    });

    if (upload.error) {
      throw new Error(upload.error.message);
    }

    if (insert.error) {
      throw new Error(insert.error.message);
    }
  }

  return data;
};

//get products with server side params
export const getProducts = async (
  params: TableParams,
  branchId: string | null,
) => {
  const from = (params.pageIndex - 1) * params.pageSize;
  const to = from + params.pageSize - 1;

  //Elegimos la fuente de datos
  const tableSource = !branchId
    ? "v_global_inventory"
    : "v_inventory_by_branch";

  let query = supabase.from(tableSource).select("*", { count: "exact" });

  //Filtro por Sucursal (solo si aplica)
  if (branchId) {
    query = query.eq("branchId", branchId);
  }

  //Búsqueda Global
  if (params.globalFilter) {
    const search = `%${params.globalFilter}%`;
    query = query.or(
      `nameProd.ilike.${search},sku.ilike.${search},brand.ilike.${search}`,
    );
  }

  //Ordenamiento
  if (params.sorting.length > 0) {
    params.sorting.forEach((sort) => {
      query = query.order(sort.id, { ascending: !sort.desc });
    });
  } else {
    // Orden por defecto para evitar saltos en paginación
    query = query.order("created_at", { ascending: false });
  }

  //Paginación
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  //Retorno de datos
  return {
    data: data || [],
    meta: {
      total: count || 0,
      page: params.pageIndex,
      limit: params.pageSize,
      totalPages: Math.ceil((count || 0) / params.pageSize),
    },
  };
};

//get product by id
export const getProductById = async (id: string) => {
  const { data, error } = await supabase
    .from("products")
    .select(`*,product_images (*)`)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

//update product
export const updateProduct = async (id: string, dataProducto: ProductSupT) => {
  //Actualizar datos del producto
  const { data, error } = await supabase
    .from("products")
    .update({
      sku: dataProducto.sku,
      nameProd: dataProducto.nameProd,
      price: dataProducto.price,
      cost: dataProducto.cost,
      description: dataProducto.description,
      brand: dataProducto.brand,
      categoryId: dataProducto.categoryId,
      unit: dataProducto.unit,
      barcode: dataProducto.barcode,
      minstock: dataProducto.minstock,
      supplierid: dataProducto.supplierid,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  //Eliminar imágenes marcadas
  if (dataProducto.imageToDelete?.length) {
    //Eliminar registros en DB
    const { error: dbError } = await supabase
      .from("product_images")
      .delete()
      .in("image_url", dataProducto.imageToDelete);

    if (dbError) throw new Error(dbError.message);

    //Eliminar archivos del bucket
    const paths = dataProducto.imageToDelete.map((url) => {
      const pathname = new URL(url).pathname;
      return pathname.replace("/storage/v1/object/public/img-products/", "");
    });

    const { error: storageError } = await supabase.storage
      .from("img-products")
      .remove(paths);

    if (storageError) throw new Error(storageError.message);
  }

  //Subir nuevas imágenes
  if (dataProducto.images?.length) {
    for (let i = 0; i < dataProducto.images.length; i++) {
      const file = dataProducto.images[i];
      const processedFile = await processProductImage(file);

      // Subir archivo
      const upload = await supabase.storage
        .from("img-products")
        .upload(`product-${data.id}/${processedFile.name}`, processedFile);

      // Obtener URL pública
      const { data: url } = supabase.storage
        .from("img-products")
        .getPublicUrl(`product-${data.id}/${processedFile.name}`);

      // Guardar URL en la base de datos
      const insert = await supabase.from("product_images").insert({
        product_id: data.id,
        image_url: url.publicUrl,
        position: i + 1,
      });

      if (upload.error) {
        throw new Error(upload.error.message);
      }

      if (insert.error) {
        throw new Error(insert.error.message);
      }
    }
  }

  return data;
};

// SOFT DELETE — desactivar producto mediante el campo deleted_at o hard delete
export const deleteProductG = async (id: string) => {
  const { data, error } = await supabase.rpc("delete_product_global", {
    p_id: id,
  });

  if (error) {
    if (error.message.includes("PRODUCT_HAS_STOCK_IN_BRANCHES")) {
      throw new Error(
        "El producto no se puede eliminar porque tiene stock en una o más sucursales.",
      );
    }
    throw new Error("Error al eliminar el producto: " + error.message);
  }

  // Solo borrar imágenes si fue hard delete definitivo
  if (data === "OK") {
    const folderPath = `product-${id}`;

    const { data: files } = await supabase.storage
      .from("img-products")
      .list(folderPath);

    if (files && files.length > 0) {
      const paths = files.map((f) => `${folderPath}/${f.name}`);
      await supabase.storage.from("img-products").remove(paths);
    }
  }

  return data;
};

//ELIMINAR PRODUCTO DE UNA SUCURSAL ESPECIFICA
export const deleteProductByBranch = async (id: string, branchId: string) => {
  const { data, error } = await supabase.rpc("delete_product_from_branch", {
    p_id: id,
    b_id: branchId,
  });

  if (error) {
    if (error.message.includes("BRANCH_PRODUCT_HAS_STOCK")) {
      throw new Error(
        "El producto no se puede eliminar de la sucursal porque tiene stock disponible.",
      );
    }

    throw new Error(
      "Error al eliminar el producto de la sucursal: " + error.message,
    );
  }

  return data;
};

//Activar oferta en producto
export const activateOfferProduct = async (
  offerData: OfferFormValues,
  prodId: string,
) => {
  const { data, error } = await supabase
    .from("products")
    .update({
      isOfferActive: offerData.isOfferActive,
      priceOffer: offerData.priceOffer,
      startDate: offerData.startDate,
      endDate: offerData.endDate,
    })
    .eq("id", prodId)
    .select()
    .single();

  if (error) {
    throw new Error("Error al activar la oferta: " + error.message);
  }

  return data;
};
