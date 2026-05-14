import FormLogin from "../../components/loginComp/FormLogin";
//hook de login tanstack-react-query
import { useLogin } from "../../hooks/auth/useLogin";
import type { loginCredentials } from "@/schemes/auth";
import { VerifyCredencials } from "../../components/loginComp/VerifyCredencials";
//import { Link } from "react-router-dom";

const LoginCard = () => {
  const { mutate, isPending, isError } = useLogin();

  const handleSubmit = (data: loginCredentials) => {
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
      <div className="absolute w-full h-full inset-0 object-cover z-0 bg-black/20"></div>
      <div
        className="relative w-full max-w-md p-8 space-y-7
      sm:space-y-9"
      >
        {/* título y descripción */}
        <div className="flex flex-col items-center gap-7 text-center text-white">
          <h1
            className="font-title text-xl
          sm:text-2xl
          lg:text-3xl"
          >
            ¡Panel de Gestión POS!
          </h1>
          <p
            className="text-sm font-body text-gray-300
          sm:text-base"
          >
            Ingresa tus credenciales para gestionar tus ventas, inventarios y
            reportes.
          </p>
        </div>

        {/* Formulario */}
        <FormLogin submitParent={handleSubmit} isPending={isPending} />

        {/* <p className="text-center text-white text-sm md:text-base">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-blue-300 hover:underline">
            Regístrate aquí
          </Link>
        </p> */}

        {/* ESTADOS DE TANSTACK */}
        {isPending && <VerifyCredencials message="Verificando credenciales" />}

        {isError && (
          <div className="mt-4 bg-red-900/30 border border-red-500/50 rounded-lg p-3 backdrop-blur-sm">
            <p className="text-red-200 text-sm text-center font-medium">
              Credenciales incorrectas. Por favor, inténtalo de nuevo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginCard;
