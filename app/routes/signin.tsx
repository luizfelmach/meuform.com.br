import * as yup from "yup";
import { AuthLayout } from "@/components/interface/auth-layout";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { prisma } from "@/lib/prisma";
import { compare } from "@/lib/crypt";
import { Link, useLoaderData, useSubmit } from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { useFlash } from "@/components/hook/flash";
import { unauthenticated } from "@/action/auth";
import {
  flashError,
  getFlash,
  headerSession,
  reqSession,
} from "@/action/session";

export default function Page() {
  const submit = useSubmit();
  const flash = useLoaderData<typeof loader>();
  useFlash(flash);

  const methods = useForm<signInType>({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(signInSchema),
  });

  async function handleSubmit(data: signInType) {
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
              name="email"
              placeholder="E-mail"
            />
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
            Não tem uma conta?{" "}
          </small>
          <Link
            to="/signup"
            className="ml-2 hover:underline text-sm leading-none font-bold"
          >
            Registre-se
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
    { title: "Meu Form | Acessar" },
    {
      name: "Acesse a plataforma Meu Form.",
      content: "Página de autenticação.",
    },
  ];
};

const signInSchema = yup.object({
  email: yup.string().email("E-mail inválido.").required("Digite seu e-mail."),
  password: yup.string().required("Digite sua senha."),
});

type signInType = yup.InferType<typeof signInSchema>;

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await reqSession(request);

  await unauthenticated(request);
  const flash = getFlash(session);

  return json(flash, { ...(await headerSession(session)) });
}

export async function action({ request }: ActionFunctionArgs) {
  await unauthenticated(request);
  const body = Object.fromEntries(await request.formData());
  const { email, password } = await signInSchema.validate(body);
  const session = await reqSession(request);

  const customer = await prisma.customer.findFirst({ where: { email } });

  if (!customer) {
    flashError(session, "Credenciais informadas estão incorretas.");
    return redirect("/signin", { ...(await headerSession(session)) });
  }

  const passwordValid = compare(password, customer.password);
  if (!passwordValid) {
    flashError(session, "Credenciais informadas estão incorretas.");
    return redirect("/signin", { ...(await headerSession(session)) });
  }

  session.set("id", customer.id);

  return redirect("/dashboard", { ...(await headerSession(session)) });
}
