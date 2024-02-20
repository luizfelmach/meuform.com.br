import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

export function useForgotForm() {
  const methods = useForm<forgotType>({
    defaultValues: { email: "" },
    resolver: yupResolver(forgotSchema),
  });

  return methods;
}

export const forgotSchema = yup.object({
  email: yup
    .string()
    .email("E-mail inválido.")
    .required("Digite seu e-mail.")
    .transform((value) => {
      if (typeof value === "string") return value.toLowerCase();
      return value;
    }),
});

export type forgotType = yup.InferType<typeof forgotSchema>;
