//hook de register tanstack-react-query
import { useRegister } from "../../hooks/auth/useRegister";
import type { RegisterFormData } from "@/schemes/register";
import { VerifyCredencials } from "../../components/loginComp/VerifyCredencials";
import { Link } from "react-router-dom";
import FormRegister from "@/components/loginComp/FormRegister";

const Register = () => {
  const { mutate, isPending, isError } = useRegister();

  const handleSubmit = (data: RegisterFormData) => {
    mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen h-full w-full h-dvh relative overflow-y-auto bg-black">
      {/* fondo */}
      {/* <img
        src="/fondoLogin.jpg"
        alt="imagen de fondo"
        className="absolute h-full w-full inset-0 object-cover z-0"
      /> */}
      {/* <div className="absolute w-full h-full object-cover z-0 bg-black/20"></div> */}
      {/* Card principal */}
      <div className="relative w-full max-w-md p-8 sm:space-y-9">
        {/* título y descripción */}
        <div className="flex flex-col items-center gap-7 text-center text-white">
          <h1
            className="font-title text-xl
          sm:text-2xl
          lg:text-3xl"
          >
            Registrate
          </h1>
          <p
            className="text-sm font-body text-gray-300
          sm:text-base"
          >
            Ingresa los datos solicitados para crear tu cuenta.
          </p>
        </div>

        {/* Formulario */}
        <FormRegister isPending={isPending} submitParent={handleSubmit} />

        <p className="text-center mt-4 text-white text-sm md:text-base">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/" className="text-blue-300 hover:underline">
            Inicia sesión aquí
          </Link>
        </p>

        {/* ESTADOS DE TANSTACK */}
        {isPending && <VerifyCredencials message="Creando cuenta" />}

        {isError && (
          <div className="mt-4 bg-red-900/30 border border-red-500/50 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-red-200 text-sm text-center font-medium">
              Ocurrio un error al registrar tu cuenta. Por favor, intenta
              nuevamente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
