import { AuthLayout } from "@/components/interface/auth-layout";
import { Link, useSubmit } from "@remix-run/react";
import { FormProvider } from "react-hook-form";
import { signInSchema, signInType, useSignInForm } from "./util";
import { ensureBody, ensureNotAuthenticated } from "@/action/middlewares";
import { singInSession } from "@/action/session";
import { redirectSession } from "@/action";
import { prisma } from "@/lib/prisma";
import { IncorrectCredentialsRequest } from "@/action/errors";
import { compare } from "@/lib/crypt";

import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";

export default function Page() {
  const submit = useSubmit();
  const methods = useSignInForm();

  async function handleSubmit(data: signInType) {
    submit(data, { method: "POST" });
  }

  return (
    <div>
      <AuthLayout.LogoFull />
      <AuthLayout.Header>
        <AuthLayout.Title>Bem-vindo novamente!</AuthLayout.Title>
        <AuthLayout.Description>Acesse sua plataforma.</AuthLayout.Description>
      </AuthLayout.Header>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleSubmit)}
          className="mt-12 space-y-6"
        >
          <AuthLayout.InputText type="text" name="email" placeholder="E-mail" />
          <AuthLayout.InputText
            type="password"
            name="password"
            placeholder="Senha"
          />
          <AuthLayout.SendButton label="Acessar" />
        </form>
      </FormProvider>
      <div className="flex justify-end mt-8">
        <Link
          to="/forgot"
          className="ml-2 hover:underline text-sm leading-none font-bold"
        >
          Esqueceu a senha?
        </Link>
      </div>
      <div className="flex justify-center py-14">
        <small className="text-sm font-medium leading-none">
          Não tem uma conta?
        </small>
        <Link
          to="/signup"
          className="ml-2 hover:underline text-sm leading-none font-bold"
        >
          Registre-se
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
    { title: "Meu Form | Acessar" },
    {
      name: "Acesse a plataforma Meu Form.",
      content: "Página de autenticação.",
    },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const body = await ensureBody<signInType>(signInSchema, request);
  const { email, password } = body;
  const { session } = await ensureNotAuthenticated(request);

  const params = new URL(request.url).searchParams;
  const next = params.get("next");
  const successUrl = new URL(next ?? "/dashboard", request.url);
  const failedUrl = new URL("/signin", request.url);
  next && failedUrl.searchParams.append("next", next);

  const customer = await prisma.customer.findFirst({ where: { email } });

  if (!customer) {
    throw await IncorrectCredentialsRequest(session, failedUrl.href);
  }

  const passwordValid = compare(password, customer.password);
  if (!passwordValid) {
    throw await IncorrectCredentialsRequest(session, failedUrl.href);
  }

  singInSession(session, {
    id: customer.id,
    email: customer.email,
    name: customer.name,
    paymentId: customer.paymentId,
  });

  return await redirectSession(successUrl.href, session);
}
