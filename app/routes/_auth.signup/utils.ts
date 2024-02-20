import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export function useSignUpForm() {
  const methods = useForm<signUpType>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    resolver: yupResolver(signUpSchema),
  });
  return methods;
}

export const signUpSchema = yup.object({
  name: yup.string().required("Digite seu nome."),
  email: yup
    .string()
    .email("E-mail inválido.")
    .required("Digite seu e-mail.")
    .transform((value) => {
      if (typeof value === "string") return value.toLowerCase();
      return value;
    }),
  password: yup
    .string()
    .required("Digite sua senha.")
    .min(6, "Mínimo de 6 caracteres."),
  confirmPassword: yup
    .string()
    .required("Confirme sua senha.")
    .oneOf([yup.ref("password")], "Sua senha não confere."),
});

export type signUpType = yup.InferType<typeof signUpSchema>;
