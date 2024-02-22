import { Separator } from "@/components/ui/separator";
import { HeaderDashboard } from "../dashboard/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { ensureAuthenticated } from "@/action/middlewares";
import { useLoaderData } from "@remix-run/react";

export default function Page() {
  const { name } = useLoaderData<typeof loader>();

  return (
    <div>
      <HeaderDashboard.Root className="max-w-5xl mx-auto px-4">
        <HeaderDashboard.Content>
          <HeaderDashboard.Title>Perfil</HeaderDashboard.Title>
          <HeaderDashboard.Description>
            Gerencie sua conta.
          </HeaderDashboard.Description>
        </HeaderDashboard.Content>
      </HeaderDashboard.Root>

      <Separator className="mb-10" />

      <div className="max-w-5xl mx-auto px-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Nome de exibição</CardTitle>
            <CardDescription>
              Esse nome será exibido no site e serve para identificar você.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              className="max-w-96 h-11 border-none bg-accent text-accent-foreground"
              defaultValue={name}
              disabled
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button disabled>Salvar</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Deletar conta</CardTitle>
            <CardDescription>
              Remover permanentemente sua Conta Pessoal e todo o seu conteúdo da
              plataforma Meu Form. Esta ação não pode ser desfeita, portanto,
              continue com cautela.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end">
            <Button variant={"destructive"} disabled>
              Deletar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { name } = await ensureAuthenticated(request);
  return json({ name });
}
