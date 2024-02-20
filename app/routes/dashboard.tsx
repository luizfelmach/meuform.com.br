import { jsonSession } from "@/action";
import { ensureAuthenticated, ensureSubscribed } from "@/action/middlewares";
import { getFlash } from "@/action/session";
import { useFlash } from "@/components/hook/flash";
import { CopyButton } from "@/components/interface/copy-button";
import { DashboardLayout } from "@/components/interface/dashboard-layout";
import { NavbarDashboard } from "@/components/interface/navbar-dashboard";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Eye, Pencil, Share } from "lucide-react";

type DashboardFormType = {
  id: string;
  name: string;
  answersCount: number;
  screensCount: number;
  updatedAt: Date;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { session, id } = await ensureAuthenticated(request);

  const flash = getFlash(session);
  if (!flash.payment) {
    await ensureSubscribed(id);
  }

  const forms = await prisma.form.findMany({
    where: { customerId: id },
    orderBy: { updatedAt: "desc" },
  });

  const response: DashboardFormType[] = forms.map((form) => {
    return {
      id: form.id,
      name: form.name,
      answersCount: form.answers.length,
      screensCount: form.screens.length + 1,
      updatedAt: form.updatedAt,
    };
  });

  return await jsonSession({ flash, response }, session);
}

export default function Page() {
  const { flash, response } = useLoaderData<typeof loader>();
  useFlash(flash);
  return (
    <div>
      <NavbarDashboard />
      <DashboardLayout.Root>
        <DashboardLayout.Header>
          <DashboardLayout.Title>Formulários</DashboardLayout.Title>
          <DashboardLayout.Description>
            Gerencie e visualize seus formulários.
          </DashboardLayout.Description>
        </DashboardLayout.Header>
        <DashboardLayout.Content>
          <DashboardForms forms={response as any} />
        </DashboardLayout.Content>
      </DashboardLayout.Root>
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
    <div className="min-h-20 bg-background border border-accent rounded-xl p-4 flex justify-between items-center">
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
