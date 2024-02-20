import * as crypto from "node:crypto";
import { AuthLayout } from "@/components/interface/auth-layout";
import { FormProvider } from "react-hook-form";
import { resend } from "@/lib/resend";
import { Link, useSubmit } from "@remix-run/react";
import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { prisma } from "@/lib/prisma";
import { flashSuccess } from "@/action/session";
import { ensureBody, ensureNotAuthenticated } from "@/action/middlewares";
import { EmailDoesNotExistsRequest } from "@/action/errors";
import { redirectSession } from "@/action";
import { forgotSchema, forgotType, useForgotForm } from "./utils";
import { hash } from "@/lib/crypt";
import { ForgotTemplate } from "./forgot-template";

export default function Page() {
  const submit = useSubmit();
  const methods = useForgotForm();

  async function handleSubmit(data: forgotType) {
    submit(data, { method: "POST" });
  }

  return (
    <div>
      <AuthLayout.LogoFull />
      <AuthLayout.Header>
        <AuthLayout.Title>Recuperar senha!</AuthLayout.Title>
        <AuthLayout.Description>
          Informe seu e-mail. Enviaremos um link de recuperação.
        </AuthLayout.Description>
      </AuthLayout.Header>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleSubmit)}
          className="mt-12 space-y-6"
        >
          <AuthLayout.InputText type="text" name="email" placeholder="E-mail" />
          <AuthLayout.SendButton label="Enviar e-mail" />
        </form>
      </FormProvider>
      <div className="flex justify-center py-14">
        <small className="text-sm font-medium leading-none">
          Já tem uma conta?
        </small>
        <Link
          to="/signin"
          className="ml-2 hover:underline text-sm leading-none font-bold"
        >
          Acesse a plataforma
        </Link>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="flex justify-center w-full items-center text-destructive">
      Aconteceu algum erro inesperado.
    </div>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "Meu Form | Recuperar senha" },
    {
      name: "Recupere sua senha.",
      content: "Página de recuperação de senha.",
    },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const { email } = await ensureBody<forgotType>(forgotSchema, request);
  const { session } = await ensureNotAuthenticated(request);

  const customer = await prisma.customer.findFirst({ where: { email } });

  if (!customer) {
    throw await EmailDoesNotExistsRequest(session);
  }

  let alreadyExistsToken = await prisma.passResetToken.findFirst({
    where: { customerId: customer.id },
  });

  if (alreadyExistsToken) {
    await prisma.passResetToken.delete({
      where: { id: alreadyExistsToken.id },
    });
  }

  let resetToken = crypto.randomBytes(32).toString("hex");
  let hashToken = hash(resetToken);
  await prisma.passResetToken.create({
    data: {
      token: hashToken,
      customerId: customer.id,
    },
  });

  const resetLink = new URL("/reset", request.url);
  resetLink.searchParams.append("id", customer.id);
  resetLink.searchParams.append("token", resetToken);

  await resend.emails.send({
    from: "Meu Form <meuform@resend.dev>",
    to: [customer.email],
    subject: "Recuperar senha | Meu Form",
    react: <ForgotTemplate name={customer.name} resetLink={resetLink.href} />,
  });

  flashSuccess(session, "Enviamos um link para você redefinir sua senha.");
  return await redirectSession("/forgot", session);
}
