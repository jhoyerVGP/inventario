import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface DebouncedInputProps {
  onChange: (value: string | number) => void;
  debounce?: number;
  valueDafault: string | number;
  placeholder?: string;
}
// Input que espera X tiempo antes de notificar el cambio
export function DebouncedInput({
  onChange,
  debounce = 300,
  valueDafault,
  placeholder = "Buscar...",
}: DebouncedInputProps) {
  const [value, setValue] = useState(valueDafault);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="relative w-full min-w-0 sm:max-w-md">
      {/* Ícono de búsqueda a la izquierda */}
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      {/* Input con padding para el ícono */}
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-9 pl-9 pr-9 font-body shadow-xs"
      />

      {/* Botón para limpiar (solo visible cuando hay texto) */}
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Limpiar búsqueda"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
