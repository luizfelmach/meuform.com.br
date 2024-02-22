import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { toast } from "sonner";
import { FormType } from "@/form/types";

interface UseFormEditorProps {
  form: FormType;
}

const FormSchema = yup.object({
  name: yup
    .string()
    .required("Digite um nome.")
    .min(3, "Mínimo de 3 caracteres.")
    .max(75, "Máximo de 75 caracteres."),
});

export function useFormEditor({ form }: UseFormEditorProps) {
  const methods = useForm<FormType>({
    mode: "onSubmit",
    values: form,
    resolver: yupResolver(FormSchema as any),
  });

  const {
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (errors["name"]) {
      toast.error("Nome do formulário inválido", {
        description: errors["name"]?.message,
      });
    }
  }, [errors["name"]]);

  return methods;
}
