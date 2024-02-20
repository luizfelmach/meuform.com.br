import { AuthLayout } from "@/components/interface/auth-layout";
import { FormProvider } from "react-hook-form";
import { prisma } from "@/lib/prisma";
import { hash } from "@/lib/crypt";
import { Link, useSubmit } from "@remix-run/react";
import { stripe } from "@/lib/stripe";
import { singInSession } from "@/action/session";
import { ensureBody, ensureNotAuthenticated } from "@/action/middlewares";
import { EmailAlreadyInUseRequest } from "@/action/errors";
import { redirectSession } from "@/action";
import { signUpSchema, signUpType, useSignUpForm } from "./utils";
import { ActionFunctionArgs, MetaFunction } from "@remix-run/node";

export default function Page() {
  const submit = useSubmit();
  const methods = useSignUpForm();

  async function handleSubmit(data: signUpType) {
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
          <AuthLayout.InputText
            type="text"
            name="name"
            placeholder="Nome completo"
          />
          <AuthLayout.InputText type="text" name="email" placeholder="E-mail" />
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
          <AuthLayout.SendButton label="Criar conta" />
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
    { title: "Meu Form | Criar conta" },
    {
      name: "Crie uma conta na plataforma Meu Form.",
      content: "Página para criar uma conta.",
    },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const body = await ensureBody<signUpType>(signUpSchema, request);
  const { name, email, password } = body;
  const { session } = await ensureNotAuthenticated(request);

  const exists = await prisma.customer.findFirst({ where: { email } });

  if (exists) {
    throw await EmailAlreadyInUseRequest(session);
  }

  const hashPassword = hash(password);
  const stripeCustomer = await stripe.customers.create({ name, email });

  const customer = await prisma.customer.create({
    data: {
      email,
      name,
      password: hashPassword,
      paymentId: stripeCustomer.id,
    },
  });

  singInSession(session, {
    id: customer.id,
    email: customer.email,
    name: customer.name,
    paymentId: customer.paymentId,
  });

  return await redirectSession("/dashboard", session);
}
