import * as yup from "yup";

export const createFormSchema = yup.object({
  name: yup
    .string()
    .required("Digite um nome.")
    .min(3, "Mínimo de 3 caracteres.")
    .max(75, "Máximo de 75 caracteres."),
});

export type createFormType = yup.InferType<typeof createFormSchema>;
