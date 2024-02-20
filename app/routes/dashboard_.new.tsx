import * as yup from "yup";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Header } from "@/components/interface/header";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Container } from "@/components/interface/container";
import { Link, useNavigate, useNavigation, useSubmit } from "@remix-run/react";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import {
  ensureAuthenticated,
  ensureBody,
  ensureSubscribed,
} from "@/action/middlewares";
import { v4 as uuid } from "uuid";
import { prisma } from "@/lib/prisma";

const createFormSchema = yup.object({
  name: yup
    .string()
    .required("Digite um nome.")
    .min(3, "Mínimo de 3 caracteres.")
    .max(75, "Máximo de 75 caracteres."),
});

type createFormType = yup.InferType<typeof createFormSchema>;

export default function Page() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const submit = useSubmit();
  const methods = useForm<createFormType>({
    defaultValues: { name: "" },
    resolver: yupResolver(createFormSchema),
  });

  const isSubmitting = navigation.state === "submitting";

  async function handleSubmit(data: createFormType) {
    submit(data, { method: "POST" });
  }

  return (
    <Container className="flex flex-col justify-center items-center h-screen">
      <div>
        <Header.Root>
          <Header.Title className="text-5xl">
            Dê um nome ao seu formulário
          </Header.Title>
        </Header.Root>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)}>
            <FormField
              name="name"
              control={methods.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="w-full h-11 border-none bg-accent text-accent-foreground"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button
                className="h-11 font-bold mt-8 bg-accent text-accent-foreground hover:bg-accent/50"
                type="button"
                onClick={() => navigate("/dashboard")}
              >
                Cancelar
              </Button>
              <Button
                className="h-11 font-bold mt-8"
                type="submit"
                disabled={isSubmitting}
              >
                Começar a editar
                {isSubmitting && <Loader className="animate-spin" />}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Container>
  );
}

const baseForm = {
  screens: [
    {
      type: "text",
      screenKey: uuid(),
      title: "Qual o seu nome ?",
      description: "Informe seu nome completo no campo abaixo.",
      options: [],
      cpf: false,
      email: false,
      required: false,
      skip: [],
    },
  ],
  endScreen: {
    type: "text",
    screenKey: uuid(),
    title: "Obrigado por responder este formulário.",
    description: "Entraremos em contato com você em breve",
    options: [],
    cpf: false,
    email: false,
    required: false,
    skip: [],
  },
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { id } = await ensureAuthenticated(request);
  await ensureSubscribed(id);

  return json({});
}

export async function action({ request }: LoaderFunctionArgs) {
  const { name } = await ensureBody(createFormSchema, request);
  const { id } = await ensureAuthenticated(request);
  await ensureSubscribed(id);

  const form = await prisma.form.create({
    data: {
      name,
      customerId: id,
      ...baseForm,
    },
  });

  return redirect(`/edit/${form.id}`);
}
