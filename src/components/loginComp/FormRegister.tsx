import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
//importamos de zod
import { registerSchema, type RegisterFormData } from "@/schemes/register";
import FormInputPassword from "../common/Form/FormInputPassword";
import { FormInput } from "../common/Form/FormInput";

interface FormLoginProps {
  submitParent: (data: RegisterFormData) => void;
  isPending: boolean;
}

const FormRegister = ({ submitParent, isPending }: FormLoginProps) => {
  //Form hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    submitParent(data);
  };

  return (
    <div className="w-full font-body">
      <form
        className="flex flex-col gap-2 font-body"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-4">
          {/* name_organization */}
          <FormInput
            label="Nombre de la empresa"
            name="name_organization"
            register={register}
            errors={errors}
            inputProps={{ placeholder: "Delux" }}
            className="w-full px-4 py-3 text-sm text-white placeholder-gray-400 bg-gray-900"
            labelClassName="block text-sm font-body text-gray-300
            sm:text-base"
          />

          {/* nombre del suuario */}
          <FormInput
            label="Nombre completo"
            name="full_name"
            register={register}
            errors={errors}
            inputProps={{ placeholder: "Juan Perez Rivera" }}
            labelClassName="block text-sm font-body text-gray-300
            sm:text-base"
            className="w-full px-4 py-3 text-sm text-white placeholder-gray-400 bg-gray-900"
          />

          {/* Phone */}
          <FormInput
            label="Teléfono"
            name="phone"
            register={register}
            errors={errors}
            inputProps={{ placeholder: "64553424" }}
            labelClassName="block text-sm font-body text-gray-300
            sm:text-base"
            className="w-full px-4 py-3 text-sm text-white placeholder-gray-400 bg-gray-900"
          />

          {/* Email */}
          <FormInput
            label="Correo electrónico"
            name="email"
            register={register}
            errors={errors}
            inputProps={{ placeholder: "juan@gmail.com" }}
            labelClassName="block text-sm font-body text-gray-300
            sm:text-base"
            className="w-full px-4 py-3 text-sm text-white placeholder-gray-400 bg-gray-900"
          />

          {/* Password */}
          <FormInputPassword
            label="Contraseña"
            name="password"
            register={register}
            errors={errors}
            className="w-full px-4 py-3 text-sm text-white placeholder-gray-400 bg-gray-900"
          />

          {/* confirm password */}
          <FormInputPassword
            label="Confirmar contraseña"
            name="confirmPassword"
            register={register}
            errors={errors}
            className="w-full px-4 py-3 text-sm text-white placeholder-gray-400 bg-gray-900"
          />

          {/* Botón de registro */}
          <button
            type="submit"
            className="w-full mt-5 py-2 text-base font-title font-medium text-black bg-white rounded-md hover:bg-gray-200 transition duration-200 shadow-lg 
            cursor-pointer"
            disabled={isPending}
          >
            Registrarse
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormRegister;
