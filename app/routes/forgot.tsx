import * as yup from "yup";
import { AuthLayout } from "@/components/interface/auth-layout";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as crypto from "node:crypto";
import { Forgot } from "@/components/template/forgot";
import { resend } from "@/lib/resend";
import { Link, useLoaderData, useSubmit } from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { prisma } from "@/lib/prisma";
import { useFlash } from "@/components/hook/flash";
import { hash } from "@/lib/crypt";
import { flashSuccess, getFlash } from "@/action/session";
import { ensureBody, ensureNotAuthenticated } from "@/action/middlewares";
import { EmailDoesNotExistsRequest } from "@/action/errors";
import { jsonSession, redirectSession } from "@/action";

export default function Page() {
  const flash = useLoaderData<typeof loader>();
  useFlash(flash);

  const submit = useSubmit();

  const methods = useForm<forgotType>({
    defaultValues: { email: "" },
    resolver: yupResolver(forgotSchema),
  });

  async function handleSubmit(data: forgotType) {
    submit(data, { method: "POST" });
  }

  return (
    <AuthLayout.Root>
      <AuthLayout.Main>
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
            <AuthLayout.InputText
              type="text"
              name="email"
              placeholder="E-mail"
            />
            <AuthLayout.SendButton label="Enviar e-mail" />
          </form>
        </FormProvider>
        <div className="flex justify-center py-14">
          <small className="text-sm font-medium leading-none">
            Já tem uma conta?{" "}
          </small>
          <Link
            to="/signin"
            className="ml-2 hover:underline text-sm leading-none font-bold"
          >
            Acesse a plataforma
          </Link>
        </div>
      </AuthLayout.Main>
      <AuthLayout.Aside>
        <AuthLayout.Banner />
      </AuthLayout.Aside>
    </AuthLayout.Root>
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

const forgotSchema = yup.object({
  email: yup
    .string()
    .email("E-mail inválido.")
    .required("Digite seu e-mail.")
    .transform((value) => {
      if (typeof value === "string") return value.toLowerCase();
      return value;
    }),
});

type forgotType = yup.InferType<typeof forgotSchema>;

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await ensureNotAuthenticated(request);
  const flash = getFlash(session);
  return await jsonSession(flash, session);
}

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

  const resetLink = new URL("forgot/reset", request.url);
  resetLink.searchParams.append("id", customer.id);
  resetLink.searchParams.append("token", resetToken);

  await resend.emails.send({
    from: "Meu Form <meuform@resend.dev>",
    to: [customer.email],
    subject: "Recuperar senha | Meu Form",
    react: <Forgot name={customer.name} resetLink={resetLink.href} />,
  });

  flashSuccess(session, "Enviamos um link para você redefinir sua senha.");
  return await redirectSession("/forgot", session);
}
