import * as yup from "yup";
import { AuthLayout } from "@/components/interface/auth-layout";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { prisma } from "@/lib/prisma";
import { compare } from "@/lib/crypt";
import { commitSession, getSession } from "@/lib/session";
import { useFlashError } from "@/components/hook/flash-error";
import {
  Link,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";

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
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("id")) return redirect("/dashboard");

  const data = { error: session.get("error"), errorId: session.get("errorId") };

  return json(data, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export default function Page() {
  const flashError = useLoaderData<typeof loader>();
  useFlashError(flashError);

  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

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
            <AuthLayout.SendButton
              label="Acessar"
              isSubmitting={isSubmitting}
            />
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

export async function action({ request }: ActionFunctionArgs) {
  const body = Object.fromEntries(await request.formData());
  const { email, password } = await signInSchema.validate(body);

  const session = await getSession(request.headers.get("Cookie"));

  const customer = await prisma.customer.findFirst({
    where: {
      email,
    },
  });

  if (!customer) {
    session.flash("error", "Credenciais informadas estão incorretas.");
    session.flash("errorId", Math.random());

    return redirect("/signin", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  const passwordValid = compare(password, customer.password);
  if (!passwordValid) {
    session.flash("error", "Credenciais informadas estão incorretas.");
    session.flash("errorId", Math.random());

    return redirect("/signin", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  }

  session.set("id", customer.id);

  return redirect("/dashboard", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
