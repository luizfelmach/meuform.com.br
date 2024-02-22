import { jsonSession } from "@/action";
import { ensureAuthenticated } from "@/action/middlewares";
import { CopyButton } from "@/components/interface/copy-button";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Eye, Pencil, Plus, Share } from "lucide-react";
import { HeaderDashboard } from "../dashboard/header";
import { Separator } from "@/components/ui/separator";
import { getFlash } from "@/action/session";
import { useFlash } from "@/components/hook/flash";

type DashboardFormType = {
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

  const response: DashboardFormType[] = forms.map((form) => {
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

export default function Page() {
  const navigate = useNavigate();
  const { response, flash } = useLoaderData<typeof loader>();
  useFlash(flash);
  return (
    <div>
      <HeaderDashboard.Root className="max-w-5xl mx-auto px-4">
        <HeaderDashboard.Content>
          <HeaderDashboard.Title>Formulários</HeaderDashboard.Title>
          <HeaderDashboard.Description>
            Gerencia seus formulários.
          </HeaderDashboard.Description>
        </HeaderDashboard.Content>
        <HeaderDashboard.Action>
          <Button className="w-full" onClick={() => navigate("/dashboard/new")}>
            Criar novo formulário <Plus className="size-5 ml-2" />
          </Button>
        </HeaderDashboard.Action>
      </HeaderDashboard.Root>

      <Separator className="mb-10" />

      <div className="max-w-5xl mx-auto px-4">
        <DashboardForms forms={response as any} />
      </div>
    </div>
  );
}

interface DashboardFormsProps {
  forms: DashboardFormType[];
}

export function DashboardForms({ forms }: DashboardFormsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {forms.map((form, index) => (
        <FormCard key={index} form={form} />
      ))}
    </div>
  );
}

function FormCard({ form }: { form: DashboardFormType }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-20 bg-accent border border-accent rounded-xl p-4 flex justify-between items-center">
      <section className="flex-1 flex flex-col">
        <p className="text-foreground font-semibold">{form.name}</p>
        <p className="text-accent-foreground mt-4 text-sm">
          Respostas: {form.answersCount}
        </p>
      </section>
      <section className="text-foreground">
        <CopyButton link={"lkjsdkfj"}>
          <Share />
        </CopyButton>
        <Button
          type="button"
          variant={"ghost"}
          size={"icon"}
          onClick={() => navigate(`/edit/${form.id}`)}
        >
          <Pencil />
        </Button>
        <Button type="submit" variant={"ghost"} size={"icon"}>
          <Eye />
        </Button>
      </section>
    </div>
  );
}
