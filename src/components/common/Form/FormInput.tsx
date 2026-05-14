import { Label } from "@/components/ui/label";
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
          "w-full bg-transparent px-3 py-2 text-sm border border-border transition",
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
