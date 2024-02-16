import * as yup from "yup";
import { AuthLayout } from "@/components/interface/auth-layout";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { useEffect } from "react";
import { toast } from "sonner";

const signInSchema = yup.object({
  email: yup.string().email("E-mail inválido.").required("Digite seu e-mail."),
  password: yup.string().required("Digite sua senha."),
});

type signInType = yup.InferType<typeof signInSchema>;

export async function action({ request, context, params }: ActionFunctionArgs) {
  const body = Object.fromEntries(await request.formData());
  console.log(body);

  if (body.email === "luizfelmach@gmail.com") {
    return {
      error: false,
      message: "",
    };
  }

  return json({
    error: true,
    message: "Credenciais informadas estão incorretas.",
  });
}

export default function Page() {
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();
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
    await new Promise((resolve) => setTimeout(resolve, 2000));
    submit(data, { method: "POST" });
  }

  useEffect(() => {
    if (actionData?.error) toast.error(actionData.message);
  }, [actionData]);

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
      </AuthLayout.Main>
      <AuthLayout.Aside>
        <AuthLayout.Banner />
      </AuthLayout.Aside>
    </AuthLayout.Root>
  );
}
