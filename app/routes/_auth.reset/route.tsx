import * as yup from "yup";
import { AuthLayout } from "@/components/interface/auth-layout";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLoaderData, useSubmit } from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { prisma } from "@/lib/prisma";
import { useFlash } from "@/components/hook/flash";
import { compare, hash } from "@/lib/crypt";
import { flashSuccess, getFlash } from "@/action/session";
import { ensureBody, ensureNotAuthenticated } from "@/action/middlewares";
import { jsonSession, redirectSession } from "@/action";
import { InvalidOrExpiredRequest } from "@/action/errors";
import {
  resetPasswordSchema,
  resetPasswordType,
  useResetPassordForm,
  validToken,
} from "./utilts";

export default function Page() {
  const submit = useSubmit();
  const { id, token } = useLoaderData<typeof loader>();
  const methods = useResetPassordForm(id, token);

  async function handleSubmit(data: resetPasswordType) {
    submit(data, { method: "POST" });
  }

  return (
    <div>
      <AuthLayout.LogoFull />
      <AuthLayout.Header>
        <AuthLayout.Title>Redefina sua senha!</AuthLayout.Title>
        <AuthLayout.Description>
          Digite uma senha segura e guarde-a com você.
        </AuthLayout.Description>
      </AuthLayout.Header>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleSubmit)}
          className="mt-12 space-y-6"
        >
          <AuthLayout.InputText
            type="password"
            name="password"
            placeholder="Senha"
          />
          <AuthLayout.InputText
            type="password"
            name="confirmPassword"
            placeholder="Confirme sua senha"
          />
          <AuthLayout.SendButton label="Redefenir senha" />
        </form>
      </FormProvider>
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

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await ensureNotAuthenticated(request);

  const params = new URL(request.url).searchParams;
  const id = params.get("id");
  const token = params.get("token");

  if (!id || !token) {
    throw await InvalidOrExpiredRequest(session);
  }

  if (!(await validToken(token, id))) {
    throw await InvalidOrExpiredRequest(session);
  }

  const data = { id: id, token: token };
  return jsonSession(data, session);
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await ensureBody<resetPasswordType>(
    resetPasswordSchema,
    request
  );
  const { id, password, token } = body;
  const { session } = await ensureNotAuthenticated(request);

  if (!(await validToken(token, id))) {
    throw await InvalidOrExpiredRequest(session);
  }

  const hashPassword = hash(password);
  await prisma.customer.update({
    where: { id },
    data: { password: hashPassword },
  });

  flashSuccess(session, "Senha atualizada. Acesse a plataforma.");
  return await redirectSession("/signin", session);
}
