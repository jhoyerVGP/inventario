const TARGET_SIZE_PX = 300;
const MAX_BYTES = 100 * 1024;
const MIN_QUALITY = 0.5;
const QUALITY_STEP = 0.1;

const loadImageBitmap = async (file: File) => {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(file);
  }

  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen"));
    };

    img.src = url;
  });
};

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("No se pudo procesar la imagen"));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });

export const processProductImage = async (file: File) => {
  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo no es una imagen valida");
  }

  const source = await loadImageBitmap(file);
  const width = "naturalWidth" in source ? source.naturalWidth : source.width;
  const height = "naturalHeight" in source ? source.naturalHeight : source.height;

  const scale = Math.min(TARGET_SIZE_PX / width, TARGET_SIZE_PX / height);
  const scaledWidth = Math.round(width * scale);
  const scaledHeight = Math.round(height * scale);
  const offsetX = Math.round((TARGET_SIZE_PX - scaledWidth) / 2);
  const offsetY = Math.round((TARGET_SIZE_PX - scaledHeight) / 2);

  const canvas = document.createElement("canvas");
  canvas.width = TARGET_SIZE_PX;
  canvas.height = TARGET_SIZE_PX;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No se pudo procesar la imagen");
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, TARGET_SIZE_PX, TARGET_SIZE_PX);
  ctx.drawImage(
    source as CanvasImageSource,
    offsetX,
    offsetY,
    scaledWidth,
    scaledHeight,
  );

  let quality = 0.9;
  let blob = await canvasToBlob(canvas, "image/webp", quality);

  while (blob.size > MAX_BYTES && quality > MIN_QUALITY) {
    quality = Math.max(MIN_QUALITY, quality - QUALITY_STEP);
    blob = await canvasToBlob(canvas, "image/webp", quality);
  }

  if (blob.size > MAX_BYTES) {
    throw new Error("La imagen supera los 100kb luego de la compresion");
  }

  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const fileName = `${baseName || "producto"}.webp`;

  return new File([blob], fileName, { type: "image/webp" });
};
