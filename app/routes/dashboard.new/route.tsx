import { Container } from "../dashboard/container";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { prisma } from "@/lib/prisma";
import { FormProvider } from "react-hook-form";
import { json, useNavigation, useSubmit } from "@remix-run/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

import {
  baseForm,
  createFormSchema,
  createFormType,
  useCreateForm,
} from "./utils";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  ensureAuthenticated,
  ensureBody,
  ensureSubscribed,
} from "@/action/middlewares";

import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

export default function Page() {
  const submit = useSubmit();
  const navigation = useNavigation();
  const methods = useCreateForm();
  const isSubmitting = navigation.state === "submitting";

  async function handleSubmit(data: createFormType) {
    submit(data, { method: "POST" });
  }

  return (
    <Container.Root>
      <Container.Header>
        <Container.Title>Criar formulário</Container.Title>
        <Container.Description>
          Crie um formulário personalizado.
        </Container.Description>
      </Container.Header>
      <Container.Content>
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
      </Container.Content>
    </Container.Root>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { id } = await ensureAuthenticated(request);
  await ensureSubscribed(id);

  return json({});
}

export async function action({ request }: LoaderFunctionArgs) {
  const { name } = await ensureBody(createFormSchema, request);
  const { id } = await ensureAuthenticated(request);
  await ensureSubscribed(id);
  const newForm = baseForm();

  const form = await prisma.form.create({
    data: {
      name,
      customerId: id,
      ...newForm,
    },
  });

  return redirect(`/editor/${form.id}`);
}
