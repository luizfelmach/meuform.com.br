import * as yup from "yup";
import { AuthLayout } from "@/components/interface/auth-layout";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLoaderData, useSubmit } from "@remix-run/react";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { prisma } from "@/lib/prisma";
import { useFlash } from "@/components/hook/flash";
import { compare, hash } from "@/lib/crypt";
import {
  flashError,
  flashSuccess,
  getFlash,
  headerSession,
  reqSession,
} from "@/action/session";
import { unauthenticated } from "@/action/auth";

export default function Page() {
  const submit = useSubmit();
  const { flash, id, token } = useLoaderData<typeof loader>();
  useFlash(flash);

  const methods = useForm<resetPasswordType>({
    defaultValues: { id, token, password: "", confirmPassword: "" },
    resolver: yupResolver(resetPasswordSchema),
  });

  async function handleSubmit(data: resetPasswordType) {
    submit(data, { method: "POST" });
  }

  return (
    <AuthLayout.Root>
      <AuthLayout.Main>
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

const resetPasswordSchema = yup.object({
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

type resetPasswordType = yup.InferType<typeof resetPasswordSchema>;

async function validToken(token: string | null, id: string | null) {
  if (!id || !token) {
    return false;
  }

  const existsToken = await prisma.passResetToken
    .findFirst({
      where: {
        customerId: id,
      },
    })
    .catch(() => null);

  if (!existsToken) {
    return false;
  }

  const isValid = compare(token, existsToken.token);
  if (!isValid) {
    return false;
  }

  const currentDate = new Date();
  const targetDate = existsToken.createdAt;
  targetDate.setMinutes(targetDate.getMinutes() + 10);
  if (currentDate.getTime() > targetDate.getTime()) {
    return false;
  }

  return true;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await reqSession(request);

  await unauthenticated(request);

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const token = url.searchParams.get("token");

  if (!(await validToken(token, id))) {
    flashError(session, "Solicitação inválida ou expirada.");
    return redirect("/forgot", { ...(await headerSession(session)) });
  }

  const flash = getFlash(session);

  const data = {
    flash,
    id: id as string,
    token: token as string,
  };

  return json(data, { ...(await headerSession(session)) });
}

export async function action({ request }: ActionFunctionArgs) {
  await unauthenticated(request);

  const body = Object.fromEntries(await request.formData());
  const { id, password, token } = await resetPasswordSchema.validate(body);

  const session = await reqSession(request);

  if (!(await validToken(token, id))) {
    flashError(session, "Solicitação inválida ou expirada.");
    return redirect("/forgot", { ...(await headerSession(session)) });
  }

  const hashPassword = hash(password);
  await prisma.customer.update({
    where: { id },
    data: { password: hashPassword },
  });

  flashSuccess(session, "Senha atualizada. Acesse a plataforma.");
  return redirect("/signin", { ...(await headerSession(session)) });
}
