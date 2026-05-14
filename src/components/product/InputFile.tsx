import React, { useState, useRef } from "react";
import { Upload, X, Plus } from "lucide-react";
import { toast } from "sonner";
//import { type UseFormSetValue } from "react-hook-form";
//import type { ProductType } from "@/types/product";

interface Props {
  value?: FileList | null;
  onChange: (files: FileList | null) => void;
  onBlur?: () => void;
  error?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  disabled?: boolean;
  imgExisting?: string[];
  //setValue?: UseFormSetValue<ProductType>;
  setValue?: any;
}
//solo se permitira 1 imagen
//cambiar maxFiles para permitir mas imagenes
const InputFile = ({
  value,
  onChange,
  onBlur,
  error,
  maxFiles = 1,
  maxSizeMB = 2,
  disabled = false,
  imgExisting = [],
  setValue,
}: Props) => {
  //** IMAGENES EXISTENTE state**//
  const [existingImages, setExistingImages] = useState<string[]>(
    imgExisting || [],
  );
  //** IMAGENES A ELIMINAR state**//
  const [deletedUrls, setDeletedUrls] = useState<string[]>([]);

  // Estado local para manejar las previews
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Convertir FileList a Array de Files con previews
  const fileListToPreviewArray = (
    fileList: FileList,
  ): { file: File; url: string }[] => {
    return Array.from(fileList).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  };

  // Sincronizar previews cuando cambia el value externo
  React.useEffect(() => {
    if (value && value.length > 0) {
      const newPreviews = fileListToPreviewArray(value);
      setPreviews(newPreviews);
    } else {
      // Limpiar URLs anteriores para evitar memory leaks
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
      setPreviews([]);
    }
  }, [value]);

  // Limpiar URLs al desmontar el componente
  React.useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, []);

  // Validar archivo individual
  const validateFile = (file: File): string | null => {
    // Validar tipo
    if (!file.type.startsWith("image/")) {
      return `${file.name} no es una imagen válida`;
    }

    // Validar tamaño en MB ${file.name}
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      return `La imagen excede el tamaño máximo de ${maxSizeMB}MB`;
    }

    return null;
  };

  // Manejar selección de archivos nuevos (AÑADIR a los existentes)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (!newFiles || newFiles.length === 0) return;

    // Obtener archivos actuales
    const currentFiles = previews.map((p) => p.file);

    // Validar cada archivo nuevo
    const validNewFiles: File[] = [];
    const errors: string[] = [];

    Array.from(newFiles).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validNewFiles.push(file);
      }
    });

    // Mostrar errores si hay
    if (errors.length > 0) {
      //alert(errors.join("\n"));
      toast.info(errors.join("\n"), {
        className: "bg-red-500 text-white",
        duration: 5000,
        position: "top-center",
      });
    }

    // Combinar archivos actuales + nuevos válidos
    const combinedFiles = [...currentFiles, ...validNewFiles];

    // Validar límite de archivos
    if (combinedFiles.length + existingImages.length > maxFiles) {
      //alert(`Solo puedes subir un máximo de ${maxFiles} imágenes`);
      toast.info("Solo puedes subir un máximo de 1 imagen", {
        className: "bg-red-500 text-white",
        duration: 5000,
        position: "top-center",
      });
      return;
    }

    // Convertir Array a FileList
    const dataTransfer = new DataTransfer();
    combinedFiles.forEach((file) => dataTransfer.items.add(file));

    // Notificar cambio al padre
    onChange(dataTransfer.files);

    // Resetear input para permitir seleccionar los mismos archivos de nuevo
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Eliminar una imagen específica (nueva)
  const handleRemoveImage = (indexToRemove: number) => {
    const currentFiles = previews.map((p) => p.file);
    const newFiles = currentFiles.filter((_, index) => index !== indexToRemove);

    // Revocar URL de la imagen eliminada
    URL.revokeObjectURL(previews[indexToRemove].url);

    if (newFiles.length === 0) {
      // Si no quedan archivos, enviar null
      onChange(null);
      setPreviews([]);
    } else {
      // Convertir Array a FileList
      const dataTransfer = new DataTransfer();
      newFiles.forEach((file) => dataTransfer.items.add(file));
      onChange(dataTransfer.files);
    }
  };

  //Eliminar una imagen existente
  const handleRemoveExistingImage = (index: number) => {
    const urlRemove = existingImages[index];

    const updatedExisting = existingImages.filter((_, i) => i !== index);
    const updatedDeleted = Array.from(new Set([...deletedUrls, urlRemove]));

    setExistingImages(updatedExisting);
    setDeletedUrls(updatedDeleted);

    if (setValue) {
      setValue("imageExisting", updatedExisting);
      setValue("imageToDelete", updatedDeleted, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  };

  // Abrir selector de archivos
  const handleOpenFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        onBlur={onBlur}
        className="hidden"
        disabled={disabled}
      />

      {/* Zona de drop o botón de selección */}
      {previews.length === 0 && existingImages.length === 0 ? (
        <div
          onClick={handleOpenFileDialog}
          className={`
            border-2 border-dashed rounded-lg p-8
            flex flex-col items-center justify-center gap-3
            cursor-pointer transition-colors
            ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-blue-500 hover:bg-blue-50"
            }
            ${error ? "border-red-500" : "border-gray-300"}
          `}
        >
          <Upload className="w-12 h-12 text-gray-400" />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              Haz clic para seleccionar imágenes
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Máximo {maxFiles} archivos de {maxSizeMB}MB cada uno
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Grid de previews */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* IMAGENES EXISTENTES */}
            {existingImages.map((url, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors"
              >
                <img
                  loading="lazy"
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-contain bg-gray-50"
                />

                {/* Overlay con botón eliminar */}
                {!disabled && (
                  <div className="absolute inset-0 transition-all flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(index)}
                      disabled={disabled}
                      className="opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 md:hover:bg-red-500 text-white rounded-full p-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {/* IMAGENES NUEVAS */}
            {previews.map((preview, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors"
              >
                <img
                  src={preview.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-contain bg-gray-50"
                />

                {/* Overlay con botón eliminar */}
                <div className="absolute inset-0 transition-all flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    disabled={disabled}
                    className="opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 md:hover:bg-red-500 text-white rounded-full p-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Botón para añadir más */}
            {previews.length + existingImages.length < maxFiles &&
              !disabled && (
                <button
                  type="button"
                  onClick={handleOpenFileDialog}
                  disabled={disabled}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-blue-500"
                >
                  <Plus className="w-8 h-8" />
                  <span className="text-xs font-medium">Añadir más</span>
                </button>
              )}
          </div>

          {/* Controles */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {previews.length + existingImages.length} de {maxFiles} imágenes
            </span>
          </div>
        </>
      )}

      {/* Mensaje de error */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default InputFile;
