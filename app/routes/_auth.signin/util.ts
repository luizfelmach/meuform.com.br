import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export function useSignInForm() {
  const methods = useForm<signInType>({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(signInSchema),
  });
  return methods;
}

export const signInSchema = yup.object({
  email: yup.string().email("E-mail inválido.").required("Digite seu e-mail."),
  password: yup
    .string()
    .required("Digite sua senha.")
    .transform((value) => {
      if (typeof value === "string") return value.toLowerCase();
      return value;
    }),
});

export type signInType = yup.InferType<typeof signInSchema>;
