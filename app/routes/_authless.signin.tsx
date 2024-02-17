import * as yup from "yup";
import { AuthLayout } from "@/components/interface/auth-layout";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Link,
  useActionData,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useEffect } from "react";
import { toast } from "sonner";
import { prisma } from "@/lib/prisma";
import { compare } from "@/lib/crypt";

const signInSchema = yup.object({
  email: yup.string().email("E-mail inválido.").required("Digite seu e-mail."),
  password: yup.string().required("Digite sua senha."),
});

type signInType = yup.InferType<typeof signInSchema>;

import { commitSession, getSession } from "@/lib/session";

export async function action({ request, context, params }: ActionFunctionArgs) {
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

    return redirect("/signin", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  const passwordValid = compare(password, customer.password);
  if (!passwordValid) {
    session.flash("error", "Credenciais informadas estão incorretas.");

    return redirect("/signin", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  session.set("id", customer.id);

  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const data = { error: session.get("error"), id: Math.random() };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Page() {
  const submit = useSubmit();
  const { error, id } = useLoaderData<typeof loader>();
  const methods = useForm<signInType>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(signInSchema),
  });

  const {
    formState: { isSubmitting },
  } = methods;

  async function handleSubmit(data: signInType) {
    submit(data, { method: "POST" });
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (error) toast.error(error);
    }, 400);
    return () => clearTimeout(timeout);
  }, [id]);

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
