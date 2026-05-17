import FormLogin from "../../components/loginComp/FormLogin";
import { useLogin } from "../../hooks/auth/useLogin";
import type { loginCredentials } from "@/schemes/auth";
import { VerifyCredencials } from "../../components/loginComp/VerifyCredencials";
import { LucideAlertCircle } from "lucide-react";

const LoginCard = () => {
  const { mutate, isPending, isError } = useLogin();

  const handleSubmit = (data: loginCredentials) => {
    mutate(data);
  };

  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2 bg-background font-body text-foreground">
      {/* COLUMNA IZQUIERDA: Formulario de Login (Estructura Premium & Limpia) */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 xl:px-24 relative z-10 bg-background">
        <div className="mx-auto w-full max-w-md space-y-8">
          {/* Header del Formulario */}
          <div className="space-y-3">
            <h1 className="font-title text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Bien venido de nuevo!
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              ¡Panel de Gestión! Por favor, ingresa tus credenciales.
            </p>
          </div>

          {/* Formulario */}
          <div className="relative">
            <FormLogin submitParent={handleSubmit} isPending={isPending} />
          </div>

          {/* Estado de Error Adaptado a las Variables de Destructive */}
          {/* Estado de Error Adaptado con Contraste Mejorado */}
          {isError && (
            <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive animate-in fade-in slide-in-from-top-2 duration-200">
              <LucideAlertCircle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold tracking-wide leading-none text-destructive">
                  Error de autenticación
                </p>
                <p className="text-xs font-medium text-destructive/90 opacity-90">
                  Credenciales incorrectas. Por favor, inténtalo de nuevo.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* COLUMNA DERECHA: Imagen Estética & Testimonial (Oculto en Móviles, Visible en LG) */}
      <div className="relative hidden lg:block bg-muted">
        {/* Imagen de fondo profesional (Reemplaza con tu ruta de imagen real) */}
        <img
          src="/FLogin.jpg"
          alt="Dashboard Preview"
          className="absolute inset-0 h-full w-full object-cover brightness-90 font-sans"
        />
        {/* Capa de degradado sutil para asegurar el contraste del texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      </div>
    </div>
  );
};

export default LoginCard;
