import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/services/registerService";

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error en registro:", error);
    },
  });
};
