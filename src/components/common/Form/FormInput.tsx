/* import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type {
  FieldValues,
  Path,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";

import { get } from "react-hook-form";

import type { ComponentProps } from "react";

interface InputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  inputProps?: ComponentProps<"input">;
  className?: string;
  labelClassName?: string;
}

export function FormInput<T extends FieldValues>({
  label,
  name,
  register,
  errors,
  inputProps,
  className,
  labelClassName,
}: InputProps<T>) {
  const error = get(errors, name);

  return (
    <div className="grid gap-2 w-full">
      <Label htmlFor={name} className={labelClassName}>
        {label}
      </Label>

      <input
        id={name}
        {...inputProps}
        {...register(name, {
          valueAsNumber: inputProps?.type === "number",
        })}
        className={cn(
          "w-full bg-transparent rounded-md px-3 py-2 text-sm border border-border transition",
          "focus:border-gray-500 focus:ring-1 focus:ring-gray-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          className,
        )}
      />

      {error && <p className="text-sm text-red-500">{String(error.message)}</p>}
    </div>
  );
}
 */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // Importamos el Input de Shadcn
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

import type {
  FieldValues,
  Path,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { get } from "react-hook-form";

interface InputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  // Cambiamos ComponentProps<"input"> para asegurarnos de que acepte las props de Shadcn
  inputProps?: React.ComponentProps<typeof Input>;
  className?: string;
  labelClassName?: string;
}

export function FormInput<T extends FieldValues>({
  label,
  name,
  register,
  errors,
  inputProps,
  className,
  labelClassName,
}: InputProps<T>) {
  const error = get(errors, name);
  const hasError = !!error;

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <Label
        htmlFor={name}
        className={cn(
          "text-xs font-semibold transition-colors",
          hasError ? "text-destructive" : "text-foreground",
          labelClassName,
        )}
      >
        {label}
      </Label>

      <Input
        id={name}
        {...inputProps}
        {...register(name, {
          valueAsNumber: inputProps?.type === "number",
        })}
        className={cn(
          // Magia CSS para ocultar las flechas de los input type="number"
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",

          // Si hay error, forzamos estilos destructivos sobre el Input de Shadcn
          hasError && "border-destructive focus-visible:ring-destructive/50",

          // Permitimos que la prop className sobrescriba si es necesario
          className,
        )}
      />

      {error && (
        <div className="flex items-center gap-1.5 mt-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle size={12} className="text-destructive shrink-0" />
          <p className="text-[11px] font-medium text-destructive leading-none">
            {String(error.message)}
          </p>
        </div>
      )}
    </div>
  );
}
