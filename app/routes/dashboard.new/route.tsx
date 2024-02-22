import { Separator } from "@/components/ui/separator";
import { HeaderDashboard } from "../dashboard/header";
import { FormProvider, useForm } from "react-hook-form";
import { json, useNavigate, useNavigation, useSubmit } from "@remix-run/react";
import { createFormSchema, createFormType } from "./utils";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import {
  ensureAuthenticated,
  ensureBody,
  ensureSubscribed,
} from "@/action/middlewares";
import { v4 as uuid } from "uuid";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { prisma } from "@/lib/prisma";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

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
    <div>
      <HeaderDashboard.Root className="max-w-5xl mx-auto px-4">
        <HeaderDashboard.Content>
          <HeaderDashboard.Title>Criar formulário</HeaderDashboard.Title>
          <HeaderDashboard.Description>
            Crie agora mesmo um formulário.
          </HeaderDashboard.Description>
        </HeaderDashboard.Content>
      </HeaderDashboard.Root>

      <Separator className="mb-10" />

      <div className="max-w-5xl mx-auto px-4">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>Nome do formulário</CardTitle>
                <CardDescription>
                  Esse nome serve para identificar o formulário.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  name="name"
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem className="sm:w-96 w-full">
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
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>
                  Começar a editar
                  {isSubmitting && <Loader className="animate-spin" />}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </FormProvider>
      </div>
    </div>
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
