import { compare } from "@/lib/crypt";
import { prisma } from "@/lib/prisma";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

export function useResetPassordForm(id: string, token: string) {
  const methods = useForm<resetPasswordType>({
    defaultValues: { id, token, password: "", confirmPassword: "" },
    resolver: yupResolver(resetPasswordSchema),
  });
  return methods;
}

export const resetPasswordSchema = yup.object({
  id: yup.string().required(),
  token: yup.string().required(),
  password: yup
    .string()
    .required("Digite sua senha.")
    .min(6, "Mínimo de 6 caracteres."),
  confirmPassword: yup
    .string()
    .required("Confirme sua senha.")
    .oneOf([yup.ref("password")], "Sua senha não confere."),
});

export type resetPasswordType = yup.InferType<typeof resetPasswordSchema>;

export async function validToken(token: string, id: string) {
  const existsToken = await prisma.passResetToken
    .findFirst({ where: { customerId: id } })
    .catch(() => null);

  if (!existsToken) return false;

  const isValid = compare(token, existsToken.token);
  if (!isValid) return false;

  const currentDate = new Date();
  const targetDate = existsToken.createdAt;
  targetDate.setMinutes(targetDate.getMinutes() + 10);

  if (currentDate.getTime() > targetDate.getTime()) return false;
  return true;
}
