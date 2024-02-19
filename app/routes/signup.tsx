import * as yup from "yup";
import { AuthLayout } from "@/components/interface/auth-layout";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { prisma } from "@/lib/prisma";
import { hash } from "@/lib/crypt";
import { Link, useLoaderData, useSubmit } from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { stripe } from "@/lib/stripe";
import { useFlash } from "@/components/hook/flash";
import { getFlash, singInSession } from "@/action/session";
import { ensureBody, ensureNotAuthenticated } from "@/action/middlewares";
import { EmailAlreadyInUseRequest } from "@/action/errors";
import { jsonSession, redirectSession } from "@/action";

export default function Page() {
  const flash = useLoaderData<typeof loader>();
  useFlash(flash);

  const submit = useSubmit();

  const methods = useForm<signUpType>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    resolver: yupResolver(signUpSchema),
  });

  async function handleSubmit(data: signUpType) {
    submit(data, { method: "POST" });
  }

  return (
    <AuthLayout.Root>
      <AuthLayout.Main>
        <AuthLayout.LogoFull />
        <AuthLayout.Header>
          <AuthLayout.Title>Bem-vindo novamente!</AuthLayout.Title>
          <AuthLayout.Description>
            Acesse sua plataforma.
          </AuthLayout.Description>
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
            <AuthLayout.InputText
              type="text"
              name="email"
              placeholder="E-mail"
            />
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
      </AuthLayout.Main>
      <AuthLayout.Aside>
        <AuthLayout.Banner />
      </AuthLayout.Aside>
    </AuthLayout.Root>
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

export const signUpSchema = yup.object({
  name: yup.string().required("Digite seu nome."),
  email: yup
    .string()
    .email("E-mail inválido.")
    .required("Digite seu e-mail.")
    .transform((value) => {
      if (typeof value === "string") return value.toLowerCase();
      return value;
    }),
  password: yup
    .string()
    .required("Digite sua senha.")
    .min(6, "Mínimo de 6 caracteres."),
  confirmPassword: yup
    .string()
    .required("Confirme sua senha.")
    .oneOf([yup.ref("password")], "Sua senha não confere."),
});

type signUpType = yup.InferType<typeof signUpSchema>;

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await ensureNotAuthenticated(request);
  const flash = getFlash(session);
  return await jsonSession(flash, session);
}

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
