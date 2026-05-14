import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

import { get } from "react-hook-form";

import { LuEye, LuEyeClosed } from "react-icons/lu";

interface InputProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
}

const FormInputPassword = <T extends FieldValues>({
  label,
  name,
  register,
  errors,
  placeholder = "••••••",
  className,
  labelClassName,
}: InputProps<T>) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const error = get(errors, name);

  return (
    <div className="space-y-2 w-full">
      <Label
        htmlFor={name}
        className={cn(
          "block text-sm font-body text-gray-300 sm:text-base",
          labelClassName,
        )}
      >
        {label}
      </Label>

      <div className="relative">
        <input
          id={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...register(name)}
          className={cn(
            "w-full px-4 py-3 text-sm text-white placeholder-gray-400 bg-gray-900 outline-none",
            className,
          )}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition cursor-pointer"
        >
          {showPassword ? <LuEye size={18} /> : <LuEyeClosed size={18} />}
        </button>
      </div>

      {error && (
        <div className="text-red-400 text-sm mt-1">{String(error.message)}</div>
      )}
    </div>
  );
};

export default FormInputPassword;
