import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { LuEyeClosed, LuEye } from "react-icons/lu";
import { loginSchema, type loginCredentials } from "../../schemes/auth";
import { Label } from "../ui/label";

interface FormLoginProps {
  submitParent: (data: loginCredentials) => void;
  isPending: boolean;
}

const FormLogin = ({ submitParent, isPending }: FormLoginProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<loginCredentials> = (data) => {
    submitParent(data);
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full font-body">
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {/* Input Email */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-foreground">
            Correo electrónico
          </Label>
          <div className="relative">
            <input
              type="email"
              placeholder="Ingresa tu email"
              {...register("email", { required: true })}
              disabled={isPending}
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50"
            />
          </div>
          {errors.email && (
            <p className="text-destructive text-xs font-medium mt-1 animate-pulse">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Input Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-foreground">
              Contraseña
            </Label>
            <a
              href="#forgot"
              className="text-xs font-semibold text-brand hover:underline transition"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password", { required: true })}
              disabled={isPending}
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent pr-12 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              {showPassword ? <LuEye size={18} /> : <LuEyeClosed size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-destructive text-xs font-medium mt-1 animate-pulse">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Checkbox de recordar sesión (Estilo de la imagen guía) */}
        <div className="flex items-center space-x-2 py-1">
          <input
            type="checkbox"
            id="remember"
            className="h-4 w-4 rounded border-input text-brand focus:ring-ring transition accent-current"
          />
          <label
            htmlFor="remember"
            className="text-xs font-medium text-muted-foreground cursor-pointer select-none"
          >
            Recordar por 30 días
          </label>
        </div>

        {/* BOTÓN DE INICIO DE SESIÓN PREMIUM (Usa los gradientes y variables del CSS) */}
        <button
          type="submit"
          className="w-full py-3 text-sm font-title font-semibold tracking-wide text-white bg-primary hover:opacity-90 active:scale-[0.99] rounded-md transition duration-200 shadow-md shadow-primary/20 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          disabled={isPending}
          style={{ background: "var(--primary)" }} // En caso de querer forzar el gradiente puedes mapear a var(--btn-premium)
        >
          {isPending ? "Iniciando sesión..." : "Sign in"}
        </button>

        {/* Botón de Google alternativo para mimetizar la interfaz moderna */}
        {/* <button
          type="button"
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium border border-input bg-background text-foreground rounded-md hover:bg-muted transition duration-150 cursor-pointer"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              className="fill-[rgb(66,133,244)]"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              className="fill-[rgb(52,168,83)]"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              className="fill-[rgb(251,188,5)]"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              className="fill-[rgb(234,67,53)]"
            />
          </svg>
          Sign in with Google
        </button> */}

        {/* Footer de registro */}
        {/* <p className="text-center text-xs text-muted-foreground pt-2">
          ¿No tienes cuenta?{" "}
          <a
            href="#register"
            className="font-semibold text-brand hover:underline"
          >
            Regístrate gratis
          </a>
        </p> */}
      </form>
    </div>
  );
};

export default FormLogin;
