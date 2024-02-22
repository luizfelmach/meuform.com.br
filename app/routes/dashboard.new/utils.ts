import * as yup from "yup";
import { v4 as uuid } from "uuid";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

export function useCreateForm() {
  const methods = useForm<createFormType>({
    defaultValues: { name: "" },
    resolver: yupResolver(createFormSchema),
  });
  return methods;
}

export const createFormSchema = yup.object({
  name: yup
    .string()
    .required("Digite um nome.")
    .min(3, "Mínimo de 3 caracteres.")
    .max(75, "Máximo de 75 caracteres."),
});

export type createFormType = yup.InferType<typeof createFormSchema>;

export function baseForm() {
  return {
    screens: [
      {
        type: "text",
        screenKey: uuid(),
        title: "Qual o seu nome ?",
        description: "Informe seu nome completo no campo abaixo.",
        options: [],
        cpf: false,
        email: false,
        required: false,
        skip: [],
      },
    ],
    endScreen: {
      type: "text",
      screenKey: uuid(),
      title: "Obrigado por responder este formulário.",
      description: "Entraremos em contato com você em breve",
      options: [],
      cpf: false,
      email: false,
      required: false,
      skip: [],
    },
  };
}
