import { jsonSession } from "@/action";
import { ensureAuthenticated } from "@/action/middlewares";
import { CopyButton } from "@/components/interface/copy-button";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Eye, Forward, Plus } from "lucide-react";
import { getFlash } from "@/action/session";
import { useFlash } from "@/components/hook/flash";
import { Container } from "../dashboard/container";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  const navigate = useNavigate();
  const { response, flash } = useLoaderData<typeof loader>();
  useFlash(flash);
  return (
    <Container.Root>
      <Container.Header
        action={
          <Button className="w-full" onClick={() => navigate("/dashboard/new")}>
            Criar novo formulário <Plus className="size-5 ml-2" />
          </Button>
        }
      >
        <Container.Title>Formulários</Container.Title>
        <Container.Description>
          Gerencia seus formulários.
        </Container.Description>
      </Container.Header>
      <Container.Content className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0">
        {response.map((form, index) => (
          <FormCard key={index} form={form as any} />
        ))}
      </Container.Content>
    </Container.Root>
  );
}

function FormCard({ form }: { form: LoaderResponse }) {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{form.name}</CardTitle>
        <CardDescription>Respostas: {form.answersCount}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end gap-1">
        <Button type="button" variant={"ghost"} size={"icon"}>
          <Eye className="size-5" />
        </Button>
        <CopyButton link={"lkjsdkfj"}>
          <Forward className="size-5" />
        </CopyButton>
        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/50"
          onClick={() => navigate(`/editor/${form.id}`)}
        >
          Editar
        </Button>
      </CardFooter>
    </Card>
  );
}

type LoaderResponse = {
  id: string;
  name: string;
  answersCount: number;
  screensCount: number;
  createdAt: Date;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, id } = await ensureAuthenticated(request);

  const forms = await prisma.form.findMany({
    where: { customerId: id },
    orderBy: { createdAt: "desc" },
  });

  const response: LoaderResponse[] = forms.map((form) => {
    return {
      id: form.id,
      name: form.name,
      answersCount: form.answers.length,
      screensCount: form.screens.length + 1,
      createdAt: form.createdAt,
    };
  });

  const flash = getFlash(session);

  return await jsonSession({ response, flash }, session);
}
